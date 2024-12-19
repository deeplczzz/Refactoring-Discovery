import React from 'react';
import s from './refactoringdetail.css';

export default class RefactoringDetail extends React.Component {

    render() {
        const { refactorings} = this.props;
        const refactoring = refactorings[0];
        console.log(refactorings);

        return (
            <div>
                <div className={s.detailtitle}>Refactoring:</div>
                <div className={s.content}>{refactoring.description}</div>
                <div className={s.list}>
                    <div className={s.leftSide}>
                        <div className={s.sidelocation}>Before:</div>
                            {refactoring.leftSideLocation.map((location, locIndex) => (
                                <div key={locIndex} className={locIndex === 0 ? s.removedetailblock : s.detailblock}>
                                    <div>filePath: {location.filePath}</div>
                                    <div>startLine: {location.startLine}</div>
                                    <div>endLine: {location.endLine}</div>
                                    <div>codeElementType: {location.codeElementType}</div>
                                    <div>description: {location.description}</div>
                                    <div>codeEntity: {location.codeElement}</div>
                                </div>
                            ))}
                    </div>
               

                    <div className={s.rightSide}>
                        <div className={s.sidelocation}>After:</div>
                            {refactoring.rightSideLocation.map((location, locIndex) => (
                                <div key={locIndex} className={locIndex === 0 ? s.adddetailblock : s.detailblock}>
                                    <div>filePath: {location.filePath}</div>
                                    <div>startLine: {location.startLine}</div>
                                    <div>endLine: {location.endLine}</div>
                                    <div>codeElementType: {location.codeElementType}</div>
                                    <div>description: {location.description}</div>
                                    <div>codeEntity: {location.codeElement}</div>
                                </div> 
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}