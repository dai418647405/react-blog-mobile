import { Table } from 'antd';
import React, {Component, PropTypes} from 'react';
import { Tabs } from 'antd';
import './css/postlist.css';
import Req from '../../Req';
import Util from '../../Util';

const TabPane = Tabs.TabPane;

const columns = [{
    title: <h6>主题</h6>,
    dataIndex: 'title',
    key: 'title',
    width: '60%',
    render: (text, record) => <h4><a href={record.link}>{text}</a></h4>
}, {
    title: <h6>回复/浏览</h6>,
    dataIndex: 'replyCount',
    key: 'replyCount/pageViewCount',
    width: '25%',
    render: (text, record) => <h6>{text}/{record.pageViewCount}</h6>
}, {
    title: <h6>最后回复</h6>,
    dataIndex: 'lastReplyTime',
    key: 'lastReplyTime',
    render: text => <h6>{Util.format(new Date(text), 'HH:mm')}</h6>
}];

let topicDefaultActiveKey = 'topic-1';
let sortTypeDefaultActiveKey = 'sortType-3';
class PostList extends Component {
    constructor(props) {
        super(props);
        const userHistory = JSON.parse(sessionStorage.getItem('userHistory'));
        if (userHistory != null) {
            userHistory.pagination.size = 'middle';
            topicDefaultActiveKey = 'topic-' + userHistory.curTopicId;
            sortTypeDefaultActiveKey = 'sortType-' + userHistory.curSortType;
        }
        this.state = {
            curTopicId : userHistory != null ? userHistory.curTopicId : 1,
            curSortType : userHistory != null ? userHistory.curSortType : 3,
            data: [],
            pagination: userHistory != null ? userHistory.pagination : {
                current : 1,
                pageSize : 15,
                total:200,
                size: 'middle'
            },
            loading: false,
        };
    }

    componentDidMount() {
        // console.log('componentDidMount');
        this.loadPostList(this.state.curTopicId, this.state.curSortType, this.state.pagination);
    }

    handlePageChange(pagination) {
        // console.log('handlePageChange start, pagination=' + pagination);
        const pager = pagination;
        this.loadPostList(this.state.curTopicId, this.state.curSortType, pagination);
        // console.log('handlePageChange end');
    };

    handleTabChange(activeKey, type) {
        // console.log('handleTabChange start: activeKey=' + activeKey + '&type=' + type);
        let curTopicId = this.state.curTopicId;
        let curSortType = this.state.curSortType;
        let pager = this.state.pagination;
        pager.current = 1;
        if (type == 1) {
            this.setState({curTopicId : activeKey.split('-')[1]});
            curTopicId = activeKey.split('-')[1];
        }
        if (type == 2) {
            this.setState({curSortType : activeKey.split('-')[1]});
            curSortType = activeKey.split('-')[1];
        }
        this.loadPostList(curTopicId, curSortType, pager);
        // console.log('handleTabChange end');
    }

    loadPostList(curTopicId, curSortType, pager) {
        // console.log('loadPostList start: curTopicId=' + curTopicId + '&curSortType=' + curSortType + '&pager=' + pager);
        this.setState({ loading: true });
        const url = '/api/hupu/list';
        const params = {
            topicId : curTopicId,
            sortType : curSortType,
            current: pager.current,
            pageSize: pager.pageSize,
            total: pager.total
        };
        Req.get(url, params ,data => {
            // console.log('result =' + data.toSource());
            if (data.code == 200) {
                // console.log('data from server' + data.data.dataList);
                this.setState({data : data.data.dataList, pagination : data.data.pager, loading: false});
            } else {
                this.setState({pagination : pager, loading: false});
            }
        });
        const userHistory = {
            curTopicId : curTopicId,
            curSortType : curSortType,
            pagination : pager
        };
        sessionStorage.setItem('userHistory', JSON.stringify(userHistory));
    }

    render() {
        return (
        <div className="card-container-mobile">
            <Tabs type="card" defaultActiveKey={topicDefaultActiveKey} onChange={(activeKey) => this.handleTabChange(activeKey, 1)}>
                <TabPane tab="湿乎乎" key="topic-1" />
                <TabPane tab="步行街" key="topic-2" />
                <TabPane tab="足球区" key="topic-3" />
                <TabPane tab="影视区" key="topic-4" />
                <TabPane tab="电竞区" key="topic-5" />
                <TabPane tab="ACG区" key="topic-6" />
            </Tabs>
            <Tabs defaultActiveKey={sortTypeDefaultActiveKey} className="sort_card_bar" onChange={(activeKey) => this.handleTabChange(activeKey, 2)}>
                <TabPane tab="今日最热" key="sortType-3" />
                <TabPane tab="过去三天最热" key="sortType-4" />
                <TabPane tab="最新发表" key="sortType-2" />
                <TabPane tab="最新回复" key="sortType-1" />
                <TabPane tab="过去七天最热" key="sortType-5" />
                <TabPane tab="历史最热" key="sortType-6" />
            </Tabs>
            <div style={{background: 'white', fontSize:'25px'}}>
                <Table columns={columns}
                       size='small'
                       rowKey={record => record.articleId}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handlePageChange.bind(this)}
                />
            </div>
            {/*{console.log('render pagination:' + this.state.pagination)}*/}
        </div>
        );
    }
}

PostList.propTypes = {};

PostList.defaultProps = {};

export default PostList;