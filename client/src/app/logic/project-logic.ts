import {Project} from "../../swagger/model/Project";
import {Locale} from "../../swagger/model/Locale";
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
                if (lt.value.length < text.minLength)
                    ++count;
                if (lt.value.length > text.maxLength)
                    ++count;
            }
        }
        return count;
    }

    getTextCount() : number {
        let count: number = 0;
        for (let text of this.project.texts) {
            count += text.values.length;
        }
        return count;
    }

    getWarningCount() : number {
        return this.getTextWarningCount();
    }

    public getInfoPercentage() : number {
        let count = this.getTextCount();
        return (count -  this.getWarningCount()) * 100 / count;
    }
}