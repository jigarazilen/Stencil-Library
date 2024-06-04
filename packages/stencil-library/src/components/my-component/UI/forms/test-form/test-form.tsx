import { Component, h } from '@stencil/core';

@Component({
  tag: 'test-form',
  styleUrl: 'test-form.css',
  shadow: true,
})
export class MyForm {

  logFormValues(event: Event) {
    event.preventDefault();
    console.log(event)
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formValues: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formValues[key] = value.toString();
    });

    console.log('Form Values:', formValues);
  }
  listProps = {
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
  }
  render() {
    return (
      <form onSubmit={(event) => this.logFormValues(event)}>
        {/* <file-upload name='my-form'/> */}
        {/* <selectable-list name="my-list" {...this.listProps}></selectable-list> */}
      
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
