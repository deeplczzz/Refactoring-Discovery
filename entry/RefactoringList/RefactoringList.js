import React from 'react';
import { List, Button, Drawer, Card} from 'antd';
import s from './refactoringlist.css';

export default class RefactoringList extends React.Component {
    state = {
        currentPage: this.props.currentPage,
        pageSize: 10,
        detailVisible: false,
        currentRefactoring: null
    };

    // 在组件更新时，确保更新当前页码
    componentDidUpdate(prevProps) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this.setState({ currentPage: this.props.currentPage });
        }
    }

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
            <div className={s.leftsidetitle}>Before Refactoring</div>
            {refactoring.leftSideLocation.map((location, locIndex) => (
                <div className={s.card}>
                    <Card size="small" key={locIndex} title={<span style={{ fontWeight: 'bold' }}>{location.codeElement}</span>} hoverable = "true">
                        <div className={s.cardrow}> <span class={s.cardtitle}>Description:</span> <span class={s.cardcontent}>{location.description}</span></div>
                        <div className={s.cardrow}> <span class={s.cardtitle}>File Path:</span> <span class={s.cardcontent}>{location.filePath}</span></div>
                        <div className={s.cardrow}> <span class={s.cardtitle}>Code Element Type:</span> <span class={s.cardcontent}>{location.codeElementType}</span></div>
                        <div className={s.cardrow}> <span class={s.cardtitle}>Lines:</span> <span class={s.cardcontent}>{location.startLine} - {location.endLine}</span></div>
                    </Card>
                </div>
            ))}

            
            <div className={s.rightsidetitle}>After Refactoring</div>
            {refactoring.rightSideLocation.map((location, locIndex) => (
                <div className={s.card}>
                    <Card size="small" key={locIndex} title={<span style={{ fontWeight: 'bold' }}>{location.codeElement}</span>} hoverable = "true">
                        <div className={s.cardrow}> <span class={s.cardtitle}>Description:</span> <span class={s.cardcontent}>{location.description}</span></div>
                        <div className={s.cardrow}> <span class={s.cardtitle}>File Path:</span> <span class={s.cardcontent}>{location.filePath}</span></div>
                        <div className={s.cardrow}> <span class={s.cardtitle}>Code Element Type:</span> <span class={s.cardcontent}>{location.codeElementType}</span></div>
                        <div className={s.cardrow}> <span class={s.cardtitle}>Lines:</span> <span class={s.cardcontent}>{location.startLine} - {location.endLine}</span></div>
                    </Card>
                </div>
            ))}
        </>
    );

    render() {
        const { refactorings, onPageChange} = this.props;
        const { currentPage, pageSize, detailVisible, currentRefactoring } = this.state;

        return (
            <div className={s.list}>
                <div className={s.listtitle}>Refactorings</div>
                <div className={s.listbody}>
                    <List
                        dataSource={refactorings.sort((a, b) => a.type.localeCompare(b.type))}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: refactorings.length,
                            onChange: (page) => {
                                this.setState({ currentPage: page });
                                onPageChange(page);
                            }
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
                                    title={`${refactoring.type}`}
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