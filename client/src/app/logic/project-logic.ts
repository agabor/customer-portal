import {Project} from "../../swagger/model/Project";
import {Locale} from "../../swagger/model/Locale";
import {LocalText} from "../../swagger/model/LocalText";
import {Text} from "../../swagger/model/Text";
export class ProjectLogic {
    constructor(private project: Project){

    }


    getLocaleTextWarningCount(localeIdx: number) : number {
        let locale: Locale = this.project.locales[localeIdx];
        let count: number = 0;
        for (let text of this.project.texts) {
            for (let lt of text.values) {
                if (lt.localeCode == locale.localeId){
                    if (lt.value.length < text.minLength)
                        ++count;
                    if (lt.value.length > text.maxLength)
                        ++count;
                }
            }
        }
        return count;
    }

    getTextWarningCount() : number {
        let count: number = 0;
        for (let text of this.project.texts) {
            for (let lt of text.values) {
                if (this.hasWarning(text, lt))
                    ++count;
            }
        }
        return count;
    }

    public hasWarning(text: Text, localText: LocalText){
        if (localText.value.length == 0)
            return true;
        if (localText.value.length < text.minLength)
            return true;
        if (localText.value.length > text.maxLength)
            return true;
        return false;
    }

    getTextCount() : number {
        let count: number = 0;
        for (let text of this.project.texts) {
            count += text.values.length;
        }
        return count;
    }

    getFieldCount() : number {
        return this.getTextCount() + this.project.images.length + this.project.files.length;
    }

    getImageWarningCount() : number {
        let count: number = 0;
        for( let img of this.project.images){
            if (img.fileName == null || img.fileName.length == 0)
                ++count;
            else if (img.width != img.preferredWidth || img.height != img.preferredHeight)
                ++count;
        }
        return count;
    }

    getFileWarningCount() : number {
        let count: number = 0;
        for( let img of this.project.files){
            if (img.fileName == null || img.fileName.length == 0)
                ++count;
        }
        return count;
    }

    getWarningCount() : number {
        return this.getTextWarningCount();
    }

    public getInfoPercentage() : number {
        let count = this.getFieldCount();
        return (count -  this.getWarningCount() - this.getImageWarningCount() - this.getFileWarningCount()) * 100 / count;
    }
}