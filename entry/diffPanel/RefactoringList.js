import React from 'react';
import { Collapse } from 'antd';
import s from './index.css';

const { Panel } = Collapse;

export default class RefactoringList extends React.Component {
    
    handleLocationClick = (leftSideLocations, rightSideLocations) => {
        this.props.onHighlightDiff(leftSideLocations, rightSideLocations);
    };

    render() {
        const { refactorings } = this.props;

        return (
            <div className={s.description}>
                <h3>Refactorings:</h3>
                {refactorings.map((refactoring, index) => (
                    <div key={index} className={s.refactoringItem}>
                        <div className={s.bottom}>
                            <strong>Type:</strong> {refactoring.type}
                            &nbsp;
                            {/* 当点击 Location 时，传递所有涉及的文件信息 */}
                            <a href="#" onClick={() => this.handleLocationClick(refactoring.leftSideLocation, refactoring.rightSideLocation)}>
                                Location
                            </a>
                            <br />
                        </div>
                        <div className={s.bottom}>
                            <strong>Description:</strong> {refactoring.description}
                            <br />
                        </div>
                        <Collapse>
                            <Panel header={"details"} key={index}>
                                <strong>Left Side Location:</strong>
                                <ul type="none">
                                    {refactoring.leftSideLocation.map((location, locIndex) => (
                                        <li key={locIndex}>
                                            <div><strong>filePath:</strong> {location.filePath}</div>
                                            <div><strong>startLine:</strong> {location.startLine}</div>
                                            <div><strong>endLine:</strong> {location.endLine}</div>
                                            <div><strong>codeElementType:</strong> {location.codeElementType}</div>
                                            <div><strong>description:</strong> {location.description}</div>
                                            <div><strong>codeEntity:</strong> {location.codeElement}</div>
                                        </li>
                                    ))}
                                </ul>
                                
                                <strong>Right Side Location:</strong>
                                <ul type="none">
                                    {refactoring.rightSideLocation.map((location, locIndex) => (
                                        <li key={locIndex}>
                                            <div><strong>filePath:</strong> {location.filePath}</div>
                                            <div><strong>startLine:</strong> {location.startLine}</div>
                                            <div><strong>endLine:</strong> {location.endLine}</div>
                                            <div><strong>codeElementType:</strong> {location.codeElementType}</div>
                                            <div><strong>description:</strong> {location.description}</div>
                                            <div><strong>codeEntity:</strong> {location.codeElement}</div>
                                        </li>
                                    ))}
                                </ul>
                            </Panel>
                        </Collapse>
                    </div>
                ))}
            </div>
        );
    }
}
