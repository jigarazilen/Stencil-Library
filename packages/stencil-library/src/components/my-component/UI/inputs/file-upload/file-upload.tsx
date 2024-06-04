import { Component, State, h, Prop, Watch, Event as StencilEvent, EventEmitter } from '@stencil/core';
import Close24 from '@carbon/icons/es/close/24';

@Component({
  tag: 'file-upload',
  styleUrl: 'file-upload.css',
  shadow: true,
})
export class FileUpload {
  @Prop() allowMultiple: boolean;
  @Prop() allowedFileTypes: Array<string>;
  @Prop() disallowedFileTypes: Array<string>;
  @Prop() fullWidth: boolean = false;
  @Prop() required: boolean;
  @Prop() error: string;
  @Prop() dragAndDropMessage: string = 'Drag and drop your files here';
  @Prop() browseFileMessage: string = 'Browse Files';
  @Prop() hideDragAndDrop: boolean = false;
  @Prop() hideButton: boolean = false;
  @Prop() id: string;

  @State() files: File[] = [];
  @State() fileWindowOpen: boolean = false;

  @StencilEvent() udpFieldChange: EventEmitter<File[]>;
  @StencilEvent() udpFieldBlur: EventEmitter<Event>;

  private hiddenInput: HTMLInputElement;
  private dragCounter: number = 0;
  constructor() {
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleBrowseFiles = this.handleBrowseFiles.bind(this);
  }

  componentWillLoad() {
    if (this.allowedFileTypes && this.disallowedFileTypes) {
      throw new Error('allowedFileTypes and disallowedFileTypes are mutually exlusive, you cannot use both props');
    }
    this.dragCounter = 0;
    // initialize hidden file input
    this.hiddenInput = document.createElement('input');
    this.hiddenInput.type = 'file';
    this.hiddenInput.multiple = this.allowMultiple;
    this.hiddenInput.style.display = 'none';
    this.hiddenInput.addEventListener('change', event => this.handleFileInput(event));
    document.body.appendChild(this.hiddenInput);
  }

  @Watch('files')
  emitEvents(newValue: File[]) {
    this.udpFieldChange.emit(newValue);
    this.udpFieldBlur.emit(new Event('file-upload'));
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    this.dragCounter++;
    dropArea.classList.add('highlight');
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    this.dragCounter--;
    if (this.dragCounter === 0) {
      dropArea.classList.remove('highlight');
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('highlight');

    const files = event.dataTransfer.files;
    this.handleFiles(files);
  }

  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
    this.fileWindowOpen = false;
  }
  handleFiles(files: FileList) {
    let newFiles = this.files;
    if (files.length === 0 && newFiles.length === 0) return;
    if (files.length && newFiles.length && !this.allowMultiple) return;
    for (let i = 0; i < files.length; i++) {
      newFiles.push(files[i]);
    }
    this.files = [...newFiles];
  }
  handleBrowseFiles(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.fileWindowOpen = true;
    this.hiddenInput.click();
  }

  handleRemoveFile(index: number) {
    this.files.splice(index, 1);
    this.files = [...this.files];
  }
  render() {
    if (!this.hiddenInput) {
      return null;
    }
    return (
      <div
        id={!this.hideDragAndDrop ? 'drop-area' : 'outer-container'}
        onDragOver={!this.hideDragAndDrop && this.handleDragOver}
        onDrop={!this.hideDragAndDrop && this.handleDrop}
        onDragEnter={!this.hideDragAndDrop && this.handleDragEnter}
        onDragLeave={!this.hideDragAndDrop && this.handleDragLeave}
        class={!this.hideDragAndDrop ? (this.fullWidth ? 'full-width' : 'contained-width') : ''}
      >
        {!this.hideDragAndDrop ? (
          <unity-typography>
            <p>{this.dragAndDropMessage}</p>
            {!this.hideButton ? <p>or</p> : ''}
          </unity-typography>
        ) : (
          ''
        )}

        {!this.hideButton ?
          <custom-button
            label={this.browseFileMessage}
            onClick={this.handleBrowseFiles}
            id={"udpRecord-file-upload-" + this.id}
            //@ts-ignore
            udprecordid={"udpRecord-file-upload-" + this.id}
          />
          : ''
        }

        {this.files.length > 0 && (
          <div class={!this.hideDragAndDrop ?"container":''}>
            <div class={!this.hideDragAndDrop ?"inner-container":""}>
              {this.files.map((file, index) => (
                <div class={!this.hideDragAndDrop ?"file-container":''} key={index}>
                  <div class="file-text">
                    <unity-typography>{file.name}</unity-typography>
                  </div>
                  <div>
                    <stencil-icon-button showLabel={false} icon={Close24} onClick={() => this.handleRemoveFile(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {this.error ? (
          <div id="error-text">
            <unity-typography>{this.error}</unity-typography>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
