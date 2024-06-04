import { Component, h, State, Method } from '@stencil/core';

@Component({
  tag: 'udp-dynamic-form',
  styleUrl: 'udp-dynamic-form.css',
  shadow: true,
})
export class UdpDynamicForm {
  @State() formData: any = {};
  exampleList = [
    {
      name: 'Tom Hanks',
      age: 65,
      gender: 'male',
      nationality: 'American',
      bestMovies: ['Forrest Gump', 'Saving Private Ryan', 'Cast Away'],
    },
    {
      name: 'Meryl Streep',
      age: 72,
      gender: 'female',
      nationality: 'American',
      bestMovies: ['The Devil Wears Prada', "Sophie's Choice", 'The Iron Lady'],
    },
    {
      name: 'Leonardo DiCaprio',
      age: 47,
      gender: 'male',
      nationality: 'American',
      bestMovies: ['Titanic', 'The Revenant', 'Inception'],
    },
    {
      name: 'Scarlett Johansson',
      age: 37,
      gender: 'female',
      nationality: 'American',
      bestMovies: ['Lost in Translation', 'Marriage Story', 'Avengers: Endgame'],
    },
    {
      name: 'Robert Downey Jr.',
      age: 56,
      gender: 'male',
      nationality: 'American',
      bestMovies: ['Iron Man', 'The Avengers', 'Chaplin'],
    },
  ];

  formConfigArray = [
    {
      'field-name': 'ClientContact',
      'search-operator': 'IN',
      'label': 'Client Contact',
      'width': 'half',
      'groupId': 2,
    },
    {
      'field-name': 'phoneNumber',
      'search-operator': 'IN',
      'label': 'Phone Number',
      'width': 'half',
      'groupId': 2,
    },
    {
      'field-name': 'title',
      'search-operator': 'IN',
      'label': 'Title',
      'operator-selector': true,
      'groupId': 2,
    },
    {
      'field-name': 'defaultClient',
      'search-operator': 'IN',
      'label': 'Default Client',
      'groupId': 2,
    },
    {
      'field-name': 'contactStatus',
      'search-operator': 'IN',
      'label': 'Contact Status',
      'width': 'half',
      'groupId': 2,
    },
    {
      'field-name': 'languageID',
      'search-operator': 'IN',
      'label': 'Language ID',
      'width': 'half',
      'type': 'select',
      'options': [
        { label: 'English', value: '1' },
        { label: 'French', value: '2' },
      ],
    },
    {
      'field-name': 'file',
      'label': 'File',
      'width': 'half',
      'type': 'file',
    },
    {
      'field-name': 'list',
      'label': 'list',
      displayKey: 'name',
      multiSelect: true,
      useCheckbox: false,
      disableSelection: false,
      valueKey: 'id',
      type: 'list',
      items: [
        {
          id: 0,
          name: 'Tom Hanks',
          age: 65,
          gender: 'male',
          nationality: 'American',
          bestMovies: ['Forrest Gump', 'Saving Private Ryan', 'Cast Away'],
          selected: true
        },
        {
          id: 1,
          name: 'Meryl Streep',
          age: 72,
          gender: 'female',
          nationality: 'American',
          bestMovies: ['The Devil Wears Prada', "Sophie's Choice", 'The Iron Lady'],
        },
        {
          id: 2,
          name: 'Leonardo DiCaprio',
          age: 47,
          gender: 'male',
          nationality: 'American',
          bestMovies: ['Titanic', 'The Revenant', 'Inception'],
        },
        {
          id: 3,
          name: 'Scarlett Johansson',
          age: 37,
          gender: 'female',
          nationality: 'American',
          bestMovies: ['Lost in Translation', 'Marriage Story', 'Avengers: Endgame'],
        },
        {
          id: 4,
          name: 'Robert Downey Jr.',
          age: 56,
          gender: 'male',
          nationality: 'American',
          bestMovies: ['Iron Man', 'The Avengers', 'Chaplin'],
        },
      ]
    },
  ];

  private selectorOptions = [
    {
      value: '=',
      label: 'Equals',
    },
    {
      value: 'IN',
      label: 'Contains',
    },
    {
      value: '<>',
      label: 'Does not Equal',
    },
    {
      value: '>',
      label: 'Greater Than',
    },
    {
      value: '<',
      label: 'Less Than',
    },
    {
      value: '>=',
      label: 'Greater Than or Equal To',
    },
    {
      value: '<=',
      label: 'Less Than or Equal To',
    },
    {
      value: 'LIKE',
      label: 'Like',
    },
    {
      value: 'STARTSWITH',
      label: 'Starts With',
    },
    {
      value: 'BETWEEN',
      label: 'Between',
    },
  ];

  handleInputChange = (event: any, fieldName?: string) => {
    // If fieldName is provided, it's a text field input
    if (fieldName) {
      this.formData[fieldName] = event.target.value;
    } else {
      // Handle udp-selector events
      const detail = event.detail;
      if (detail && detail.fieldName) {
        if (detail.fieldName.endsWith('_operator')) {
          const actualFieldName = detail.fieldName.replace('_operator', '');
          this.formData[actualFieldName + '_operator'] = detail.value;
        } else {
          this.formData[detail.fieldName] = detail.value;
        }
      }
    }
  };

  @Method()
  async getFormData() {
    return this.formConfigArray
      .filter(config => this.formData[config['field-name']])
      .map(config => ({
        searchField: config['field-name'],
        searchOperator: this.formData[config['field-name'] + '_operator'] || config['search-operator'],
        searchValue: this.formData[config['field-name']],
        groupId: config['groupId'], // Add groupId here
      }));
  }
  getField(fieldConfig) {
    switch (fieldConfig.type) {
      case 'select':
        return (
          <udp-selector label={fieldConfig.label} fieldName={fieldConfig['field-name']} options={fieldConfig.options} onOptionSelected={this.handleInputChange}></udp-selector>
        );
      case 'file':
        return <file-upload allowMultiple disallowedFileTypes={['image/png', 'image/jpeg']} />;
      case 'list':
        return <selectable-list {...fieldConfig}/>;
      default:
        return (
          <text-field
            label={fieldConfig.label}
            placeholder={`Enter ${fieldConfig.label}`}
            value={this.formData[fieldConfig['field-name']] || ''}
            handleInput={(event: any) => this.handleInputChange(event, fieldConfig['field-name'])}
          ></text-field>
        );
    }
  }

  renderFormFields() {
    return this.formConfigArray.map(fieldConfig => {
      const fieldGroupStyle = fieldConfig['operator-selector']
        ? { display: 'flex', flexDirection: 'row', background: '#ccc', padding: '10px', borderRadius: '8px', marginBottom: '20px', gap: '24px' }
        : { display: 'flex', flexDirection: 'column', marginBottom: '20px', marginRight: '24px' };

      const fieldElement = this.getField(fieldConfig);

      const operatorSelector = fieldConfig['operator-selector'] ? (
        <udp-selector
          label="Search Condition"
          fieldName={fieldConfig['field-name'] + '_operator'}
          options={this.selectorOptions}
          onOptionSelected={this.handleInputChange}
        ></udp-selector>
      ) : null;

      return (
        <div style={fieldGroupStyle}>
          {fieldElement}
          {operatorSelector}
        </div>
      );
    });
  }

  render() {
    return <div class="form-root">{this.renderFormFields()}</div>;
  }
}
