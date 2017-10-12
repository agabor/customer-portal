import {ProjectLogic} from './project-logic';

describe('ProjectLogic test', () => {
  it('smoke test', () => expect( new ProjectLogic({
    texts: [],
    images: [],
    files: []
  }).getWarningCount()).toBe(0));
  it('text length test', () => expect( new ProjectLogic({
    texts: [{
      minLength: 2,
      maxLength: 5,
      values: [
        {
          languageCode: 'hu',
          value: 'a'
        },
        {
          languageCode: 'en',
          value: 'bbbbbb'
        }
      ]
    }],
    images: [],
    files: []
  }).getWarningCount()).toBe(2));
});
