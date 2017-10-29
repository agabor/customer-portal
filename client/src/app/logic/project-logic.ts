import {Project} from '../../swagger/model/Project';
import {Language} from '../../swagger/model/Language';
import {LocalText} from '../../swagger/model/LocalText';
import {Text} from '../../swagger/model/Text';
import {Image} from '../../swagger/model/Image';
export class ProjectLogic {

  public static hasWarning(text: Text, localText: LocalText) {
    if (localText.value.length === 0) {
      return true;
    }
    if (localText.value.length < text.minLength) {
      return true;
    }
    return localText.value.length > text.maxLength;

  }


  public static imageHasWarning(img: Image): boolean {
    if (img.fileName == null || img.fileName.length === 0) {
      return true;
    } else if (img.width < img.minWidth || img.width > img.maxWidth || img.height < img.minHeight || img.height > img.maxHeight) {
      return true;
    }
    return false;
  }

  constructor(private project: Project) {

  }

  getLocaleTextWarningCount(languageIdx: number): number {
    const language: Language = this.project.languages[languageIdx];
    let count = 0;
    for (const text of this.project.texts) {
      for (const lt of text.values) {
        if (lt.languageCode === language.code) {
          if (lt.value.length < text.minLength) {
            ++count;
          }
          if (lt.value.length > text.maxLength) {
            ++count;
          }
        }
      }
    }
    return count;
  }

  getTextWarningCount(): number {
    let count = 0;
    for (const text of this.project.texts) {
      for (const lt of text.values) {
        if (ProjectLogic.hasWarning(text, lt)) {
          ++count;
        }
      }
    }
    return count;
  }

  getTextCount(): number {
    let count = 0;
    for (const text of this.project.texts) {
      count += text.values.length;
    }
    return count;
  }

  getFieldCount(): number {
    return this.getTextCount() + this.project.images.length + this.project.files.length;
  }

  getImageWarningCount(): number {
    let count = 0;
    for (const img of this.project.images) {
      if (ProjectLogic.imageHasWarning(img)) {
        ++count;
      }
    }
    return count;
  }

  getFileWarningCount(): number {
    let count = 0;
    for (const img of this.project.files) {
      if (img.fileName == null || img.fileName.length === 0) {
        ++count;
      }
    }
    return count;
  }

  getWarningCount(): number {
    return this.getTextWarningCount() + this.getImageWarningCount() + this.getFileWarningCount();
  }

  public getInfoPercentage(): number {
    const count = this.getFieldCount();
    return (count - this.getWarningCount()) * 100 / count;
  }
}
