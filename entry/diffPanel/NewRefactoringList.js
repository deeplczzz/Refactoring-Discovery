import React from 'react';
import { List, Button, Drawer} from 'antd';
import s from './refactoringlist.css';

export default class NewRefactoringList extends React.Component {
    state = {
        currentPage: 1,
        pageSize: 20,
        detailVisible: false,
        currentRefactoring: null
    };

    handleLocationClick = (leftSideLocations, rightSideLocations, Description) => {
        window.scrollTo(0, 0);
        this.props.onHighlightDiff(leftSideLocations, rightSideLocations, Description);
    };

    showDetail = (refactoring) => {
        this.setState({
            detailVisible: true,
            currentRefactoring: refactoring
        });
    };

    closeDetail = () => {
        this.setState({
            detailVisible: false,
            currentRefactoring: null
        });
    };

    renderDetail = (refactoring) => (
        <>
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
        </>
    );

    render() {
        const { refactorings} = this.props;
        const { currentPage, pageSize, detailVisible, currentRefactoring } = this.state;

        return (
            <div className={s.list}>
                <div className={s.listtitle}>Refactorings</div>
                <div className={s.listbody}>
                    <List
                        dataSource={refactorings}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: refactorings.length,
                            onChange: (page) => this.setState({ currentPage: page })
                        }}
                        renderItem={(refactoring) => (
                            <List.Item
                                actions={[
                                    <Button 
                                        type="link"
                                        onClick={() => this.handleLocationClick(
                                            refactoring.leftSideLocation.slice(0, 1),
                                            refactoring.rightSideLocation.slice(0, 1),
                                            refactoring.description
                                        )}
                                    >
                                        Location
                                    </Button>,
                                    <Button 
                                        type="link"
                                        onClick={() => this.showDetail(refactoring)}
                                    >
                                        Detail
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={`Type: ${refactoring.type}`}
                                    description={refactoring.description}
                                />
                            </List.Item>
                        )}
                    />
                </div>


                <Drawer
                    title="Refactoring Details"
                    placement="right"
                    onClose={this.closeDetail}
                    open={detailVisible}
                    width={500}
                >
                    {currentRefactoring && this.renderDetail(currentRefactoring)}
                </Drawer>
            </div>
        );
    }
}