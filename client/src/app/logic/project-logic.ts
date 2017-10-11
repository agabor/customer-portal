import {Project} from '../../swagger/model/Project';
import {Language} from '../../swagger/model/Language';
import {LocalText} from '../../swagger/model/LocalText';
import {Text} from '../../swagger/model/Text';
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

  constructor(private project: Project) {

  }

    getLocaleTextWarningCount(localeIdx: number): number {
      const language: Language = this.project.languages[localeIdx];
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
        for ( const img of this.project.images){
            if (img.fileName == null || img.fileName.length === 0) {
              ++count;
            } else if (img.width !== img.preferredWidth || img.height !== img.preferredHeight) {
              ++count;
            }
        }
        return count;
    }

    getFileWarningCount(): number {
        let count = 0;
        for ( const img of this.project.files){
            if (img.fileName == null || img.fileName.length === 0) {
              ++count;
            }
        }
        return count;
    }

    getWarningCount(): number {
        return this.getTextWarningCount();
    }

    public getInfoPercentage(): number {
        const count = this.getFieldCount();
        return (count -  this.getWarningCount() - this.getImageWarningCount() - this.getFileWarningCount()) * 100 / count;
    }
}
