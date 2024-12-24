import React from 'react';
import s from './refactoringdetail.css';
import { t, setLanguage } from '../../i18n';

export default class RefactoringDetail extends React.Component {
    state = {
        language:'en',
    };

    componentDidMount() {
        window.electronAPI.getLanguage().then((lang) => {
            setLanguage(lang);
            this.setState({ language: lang });
        });
        window.electronAPI.onLanguageChanged((lang) => {
            setLanguage(lang);
            this.setState({ language: lang });
        });
    }

    render() {
        const { refactorings} = this.props;
        const refactoring = refactorings[0];
        console.log(refactorings);

        return (
            <div>
                <div className={s.detailtitle}>{t('location_refactoring')}</div>
                <div className={s.content}>{refactoring.description}</div>
                <div className={s.list}>
                    <div className={s.leftSide}>
                        <div className={s.sidelocation}>{t('before')}</div>
                            {refactoring.leftSideLocation.map((location, locIndex) => (
                                <div key={locIndex} className={locIndex === 0 ? s.removedetailblock : s.detailblock}>
                                    <div>{t('location_filepath')}{location.filePath}</div>
                                    <div>{t('startLine')}{location.startLine}</div>
                                    <div>{t('endLine')}{location.endLine}</div>
                                    <div>{t('codeelementtype')}{location.codeElementType}</div>
                                    <div>{t('description')}{location.description}</div>
                                    <div>{t('codeentity')}{location.codeElement}</div>
                                </div>
                            ))}
                    </div>
               

                    <div className={s.rightSide}>
                        <div className={s.sidelocation}>{t('after')}</div>
                            {refactoring.rightSideLocation.map((location, locIndex) => (
                                <div key={locIndex} className={locIndex === 0 ? s.adddetailblock : s.detailblock}>
                                    <div>{t('location_filepath')}{location.filePath}</div>
                                    <div>{t('startLine')}{location.startLine}</div>
                                    <div>{t('endLine')}{location.endLine}</div>
                                    <div>{t('codeelementtype')}{location.codeElementType}</div>
                                    <div>{t('description')}{location.description}</div>
                                    <div>{t('codeentity')}{location.codeElement}</div>
                                </div> 
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}