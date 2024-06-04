import { Component, State, h, Prop, Element, Build } from '@stencil/core';
import { Guid, Form, Question, StyleOverrides } from '../types';
import { UdpFormsFieldTypeEnum } from '../enums';
import { makeApiCall } from '../../../../../../udp-utilities/api/makeApiCall/makeApiCall';
import { fontOverrideMapping, overrideFont } from '../utils';
function isFileArray(array: any): array is File[] {
  // Check if it's an array
  if (!Array.isArray(array)) {
    return false;
  }

  // Check if all elements in the array are instances of File
  return array.every(item => item instanceof File);
}
function objectToFormData(obj): FormData {
  const formData = new FormData();
  const formObj = {};
  for (let key in obj) {
    let value;
    if (obj[key]?.value) {
      value = obj[key].value;
    } else {
      value = obj[key];
    }
    if (isFileArray(value)) {
      formData.append('formFiles', value[0]);
      formObj[key] = value[0].name;
    } else if (Array.isArray(value)) {
      formObj[key] = value.map(item => (typeof item === 'string' ? item : item.value)).join(',');
    } else {
      formObj[key] = value;
    }
  }
  formData.append('formData', JSON.stringify(formObj));
  return formData;
}

function getInitialValues(form: Form): { [key: string]: string } {
  const questionNames = form.formQuestions.map(fq => fq.name.toLowerCase());
  const query = window.location.href.split('?')?.[1];
  if (!query) return {};
  const urlParams = new URLSearchParams(query);
  const queryParams: { [key: string]: string } = {};
  urlParams.forEach((value, key) => {
    if (!['udpf_formid', 'udpf_tenantid', 'udpf_callback_url'].includes(key.toLowerCase()) && questionNames.includes(key.toLowerCase())) queryParams[key] = value;
  });

  return queryParams;
}
@Component({
  tag: 'udp-forms-renderer',
  styleUrl: 'udp-forms-renderer.css',
  shadow: true,
})
export class UdpFormsRenderer {
  @Prop() formId: Guid;
  @Prop() tenantId: Guid;
  @Prop() version: number;
  @Prop() productId: number;
  @Prop() triggerAction: (actionId: Guid, params: Object) => void;
  @Prop() getAccessToken: () => Promise<string>;
  @Prop() isPublic: boolean = false;
  @Prop() callbackUrl: string;
  @State() form: Form;
  @State() description: string = '';
  @State() overflow: string = '';
  @State() initialValues: { [name: string]: any } = {};
  @State() submitSuccessful: boolean = false;
  @Element() el: HTMLElement;
  @State() loading: boolean;
  @State() titleRef?: HTMLElement;
  @State() descriptionRef?: HTMLElement;

  private getFormMethodId: Guid = null;
  private apiCatalogId: Guid = null;
  private apiBaseUrlId: Guid = null;
  private useMocks: boolean = Build.isDev;
  private titleId: string = 'udp-forms-title';
  private descriptionId: string = 'udp-forms-description';
  @Prop({ mutable: true }) apiUrlBase: string = null;

  @Prop() unityUrl: string;

  constructor() {
    this.submitForm = this.submitForm.bind(this);
    this.validate = this.validate.bind(this);
    this.finishForm = this.finishForm.bind(this);
  }
  async componentWillLoad() {
    // this.handleDescriptionSplit();

    if (this.useMocks) {
      const formData = (await import('../mockData')).default;
      this.form = formData;
    } else if (!this.isPublic) {
      await this.getApiCatalog();
      await this.getApiMethods();
      await this.getPrivateForm();
    } else {
      await this.getPublicForm();
    }

    this.initialValues = getInitialValues(this.form);
  }
  async componentDidLoad() {
    this.overrideStyles();
    if (!this.isPublic && !this.useMocks) await this.getApiUrlBase();
    // await this.getAction();
  }

  async getApiCatalog() {
    const accessToken = await this.getAccessToken();
    const { apiCatalogId, apiUrlBaseId } = await makeApiCall(
      'GET',
      `${this.unityUrl}/IntegrationService/api/v1/tenantProductApiCatalogBase/tenant/${this.tenantId}/product/${this.productId}`,
      accessToken,
      {},
      this.tenantId,
    );
    this.apiCatalogId = apiCatalogId;
    this.apiBaseUrlId = apiUrlBaseId;
  }

  async getApiUrlBase() {
    const accessToken = await this.getAccessToken();
    this.apiUrlBase = (await makeApiCall('GET', `${this.unityUrl}/IntegrationService/api/v2/ApiUrlBase/${this.apiBaseUrlId}`, accessToken, {}, this.tenantId)).url;
  }

  async getApiMethods() {
    const accessToken = await this.getAccessToken();
    const searchDescribe = {
      filterElements: [
        {
          searchValue: `api/v{udp-api-version}/UdpForm/{id}/${this.version ? this.version + '/' : ''}describe${this.isPublic ? '/public' : ''}`,
          searchOperator: `=`,
          searchField: 'Path',
        },
        {
          searchValue: this.apiCatalogId,
          searchOperator: '=',
          searchField: 'apiCatalogId',
        },
      ],
      eagerLoad: false,
      pageSize: 1,
    };

    const [describe /* submit*/] = await Promise.all([makeApiCall<any>('POST', `${this.unityUrl}/IntegrationService/api/v2/ApiMethod/search`, accessToken, searchDescribe, '')]);

    this.getFormMethodId = describe?.pageList?.[0]?.apiMethodId;
    // this.submitMethodId = submit?.pageList?.[0]?.apiMethodId;
  }
  async getPrivateForm(): Promise<void> {
    const accessToken = await this.getAccessToken();
    const body: { [key: string]: string | number } = { id: this.formId };
    if (this.version) {
      body.version = this.version;
    }

    const formData: Form = await makeApiCall(
      'POST',
      `${this.unityUrl}/IntegrationService/api/v1/ApiMethod/ExecuteQueryWithParameters/${this.getFormMethodId}`,
      accessToken,
      body,
      this.tenantId,
    );
    if (formData.styleOverrides && typeof formData.styleOverrides === 'string') {
      formData.styleOverrides = JSON.parse(formData.styleOverrides) as StyleOverrides;
    }
    this.form = formData;
  }

  overrideStyles() {
    this.el.shadowRoot?.querySelectorAll('unity-typography').forEach(element => {
      const fontOverride =
        element.id === this.titleId
          ? this.form?.styleOverrides?.titleText?.fontFamily
          : element.id === this.descriptionId
          ? this.form?.styleOverrides?.paragraphText?.fontFamily
          : '';
      if (!fontOverride || !fontOverrideMapping[fontOverride]) return;

      overrideFont(element, fontOverrideMapping[fontOverride]);
    });
  }
  async getPublicForm(): Promise<void> {
    const formData: Form = await makeApiCall('GET', `${this.apiUrlBase}/UdpForm/${this.formId}/describe/public?tenantId=${this.tenantId}`, '', {}, this.tenantId)
      .then(data => {
        if (data.id) {
          return data;
        } else {
          alert('form not found');
          return null;
        }
      })
      .catch(() => {
        // this would get thrown when the form exists but is private

        alert('form not found');
        return null;
      });
    if (formData.styleOverrides && typeof formData.styleOverrides === 'string') {
      formData.styleOverrides = JSON.parse(formData.styleOverrides) as StyleOverrides;
    }
    this.form = formData;
  }
  async submitForm(values: any): Promise<void> {
    this.loading = true;
    if (this.useMocks) {
      console.log(values);
      await setTimeout(() => {
        this.loading = false;
        this.submitSuccessful = true;
        return;
      }, 3000);
      return;
    }
    const accessToken = this.isPublic ? '' : await this.getAccessToken();
    //event.preventDefault();

    const formData = objectToFormData(values);

    this.submitSuccessful = await makeApiCall(
      'POST',
      `${this.apiUrlBase + (this.isPublic ? '' : '/api/v1')}/UdpForm/${this.form.id}/${this.form.version}/submit${this.isPublic ? '/public?tenantId=' + this.tenantId : ''}`,
      accessToken,
      formData,
      this.tenantId,
      true,
    )
      .then(() => true)
      .catch(() => false)
      .finally(() => (this.loading = false));
  }

  handleDescriptionSplit() {
    const text = this.form.description && this.form.description;
    const maxLength = 300; // Maximum length before considering split
    const minLength = 50; // Minimum length to avoid trivial overflow

    if (text.length > maxLength) {
      let lastSpaceIndex = text.lastIndexOf(' ', maxLength);

      // Check if the first part is at least minLength long
      if (lastSpaceIndex < minLength) {
        lastSpaceIndex = text.indexOf(' ', minLength);
        if (lastSpaceIndex === -1) lastSpaceIndex = text.length; // No space found, take whole text
      }

      this.description = text.substring(0, lastSpaceIndex) + '...';
      this.overflow = text.substring(lastSpaceIndex + 1);
    } else {
      this.description = text; // If under maxLength, no need to split
      this.overflow = '';
    }
  }
  validate(values: Object, errors: Object) {
    Object.keys(values).forEach(key => {
      // if the field alreayd has an error, return
      if (errors[key]) return;
      const question = this.form.formQuestions.find(fq => fq.name === key);
      if (question?.fieldProperties?.minCharacter != null && values[key] && values[key]?.length < question?.fieldProperties?.minCharacter) {
        errors[key] = `Content must be at least ${question?.fieldProperties?.minCharacter} characters`;
      } else if (question?.fieldProperties?.maxCharacter != null && values[key] && values[key].length > question?.fieldProperties?.maxCharacter) {
        errors[key] = `Content must not be longer than ${question?.fieldProperties?.maxCharacter}`;
      } else if (
        Object.keys(question?.fieldProperties ?? {}).includes('allowFutureDate') &&
        !question?.fieldProperties?.allowFutureDate &&
        values[key] &&
        new Date(values[key]) > new Date()
      ) {
        errors[key] = `Date must not be in the future`;
      } else if ((question.fieldProperties?.minTime != null || question.fieldProperties?.maxTime != null) && values[key]) {
        if (question.fieldProperties?.minTime?.split?.(':')?.length < 2 || question.fieldProperties?.maxTime?.split?.(':')?.length < 2 || values[key].split(':').length < 2) return;

        const [minHour, minMinute] = question.fieldProperties?.minTime?.split?.(':')?.map?.(val => parseInt(val)) ?? [null, null];
        const [hour, minute] = values[key].split(':')?.map?.(val => parseInt(val));
        const [maxHour, maxMinute] = question.fieldProperties?.maxTime?.split?.(':')?.map?.(val => parseInt(val)) ?? [null, null];

        if (minHour != null && minMinute != null && (hour < minHour || (hour === minHour && minute < minMinute))) {
          errors[key] = `Time must be after ${question.fieldProperties?.minTime}`;
        } else if (maxHour != null && maxMinute != null && (hour > maxHour || (hour === maxHour && minute > maxMinute))) {
          errors[key] = `Time must be before ${question.fieldProperties?.maxTime}`;
        }
      } else if (question?.fieldProperties?.minDateTime != null && values[key] && new Date(values[key]) < new Date(question?.fieldProperties?.minDateTime)) {
        errors[key] = `Date must be after ${question?.fieldProperties?.minDateTime}`;
      } else if (question?.fieldProperties?.maxDateTime != null && values[key] && new Date(values[key]) > new Date(question?.fieldProperties?.maxDateTime)) {
        errors[key] = `Date must be before ${question?.fieldProperties?.maxDateTime}`;
      } else if (question?.fieldProperties?.minDate != null && values[key] && new Date(values[key]) < new Date(question?.fieldProperties?.minDate)) {
        errors[key] = `Date must be after ${question?.fieldProperties?.minDate}`;
      } else if (question?.fieldProperties?.maxDate != null && values[key] && new Date(values[key]) > new Date(question?.fieldProperties?.maxDate)) {
        errors[key] = `Date must be before ${question?.fieldProperties?.maxDate}`;
      }
    });
    return errors;
  }

  finishForm() {
    if (this.callbackUrl) {
      window.location.href = this.callbackUrl;
      return;
    }
    if (this.form.actionId && this.triggerAction) {
      this.triggerAction(this.form.actionId, {});
      return;
    }
    if (this.useMocks) {
      this.submitSuccessful = false;
      return;
    }
    window.history.back();
  }

  render() {
    let questionNumber = 1;

    const sectionSet = new Set();
    this.form.formQuestions.forEach(fq => sectionSet.add(fq.section));
    const orderedSectionNumbers = [...sectionSet].sort((a: number, b: number) => a - b);

    const hiddenQuestionTypes = [UdpFormsFieldTypeEnum.Hidden, UdpFormsFieldTypeEnum.Paragraph];

    const backgroundOverrides: { backgroundImage?: string | null; backgroundColor?: string | null } = {};
    if (this.form?.styleOverrides?.background?.backgroundImage) {
      // uncomment when we want to allow background images
      //backgroundOverrides.backgroundImage = `url(${this.form?.styleOverrides?.background?.backgroundImage})`;
    } else if (this.form?.styleOverrides?.background?.backgroundColor) {
      backgroundOverrides.backgroundColor = this.form?.styleOverrides?.background?.backgroundColor;
    }
    return (
      <div class={'background'} style={backgroundOverrides}>
        <div style={{ height: '100vh' }} class="container">
          <div class="inner-container">
            {!this.submitSuccessful ? (
              <stencil-form handleSubmit={this.submitForm} initialValues={this.initialValues} validate={this.validate}>
                <div class="scrollable">
                  {/********** QUESTIONS *********/}
                  {orderedSectionNumbers.map((sectionNumber, i) => (
                    <udp-ambient-card width="100%">
                      {sectionNumber === orderedSectionNumbers[0] && (
                        // @ts-ignore
                        <div class="header" style={this.form?.styleOverrides?.headerBackgroundColor ? { backgroundColor: this.form?.styleOverrides?.headerBackgroundColor } : ''}>
                          <unity-typography ref={el => (this.titleRef = el)} id={this.titleId} variant={this.form?.styleOverrides?.titleText?.variant ?? 'h2'}>
                            {this.form.name}
                          </unity-typography>
                          <unity-typography ref={el => (this.descriptionRef = el)} id={this.descriptionId} variant={this.form?.styleOverrides?.paragraphText?.variant ?? 'body'}>
                            {this.form.description}
                          </unity-typography>
                        </div>
                      )}
                      <div class="items">
                        {this.form.formQuestions
                          .filter(fq => fq.section === sectionNumber)
                          .sort((a, b) => a.questionOrder - b.questionOrder)
                          .map((question: Question) => {
                            const isHidden = hiddenQuestionTypes.includes(question.fieldTypeId);
                            const num: number = questionNumber;
                            if (!isHidden) questionNumber++;
                            return (
                              <div class="item">
                                <udp-question
                                  styleOverrides={{
                                    helperText: this.form.styleOverrides?.helperText,
                                    paragraphText: this.form.styleOverrides?.paragraphText,
                                    questionText: this.form.styleOverrides?.questionText,
                                  }}
                                  question={question}
                                  questionNumber={num}
                                  value={this.initialValues[question.name]}
                                />
                              </div>
                            );
                          })}
                      </div>
                      {i === orderedSectionNumbers.length - 1 && (
                        <div class="footer">
                          <input
                            disabled={this.loading}
                            type="submit"
                            value="Submit"
                            class="submit"
                            id="udpRecord-udp-forms-renderer-Submit"
                            //@ts-ignore
                            udprecordid="udpRecord-udp-forms-renderer-Submit"
                          />
                        </div>
                      )}
                    </udp-ambient-card>
                  ))}
                </div>
              </stencil-form>
            ) : (
              //if the form has been submit, display success message with a button to trigger the action associated to the form
              <div class="center-div">
                <udp-ambient-card>
                  <div class="submit-card">
                    <unity-typography>Thank you for your submission!</unity-typography>
                    <div class="finish-button">
                      <custom-button onClick={this.finishForm}>Finish</custom-button>
                    </div>
                  </div>
                </udp-ambient-card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
