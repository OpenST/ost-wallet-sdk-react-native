import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';

import Cell from './SkusCell';
import styles from './styles';
import RedemptionSkusModel from "../services/OstJsonApiPagination/RedemptionSkusModel";
import Pagination from '../services/OstJsonApiPagination/Pagination';

class SkusList extends React.PureComponent{
    constructor( props ){
        super(props);
        this.userId = this.props.userId;
        if(!this.userId) return;
        this.redemptionSkusModel = null ;
        this.pagination = null;
        this.init();
        this.state = {
            list: [1,2,3],
            loadingNext: false
        }
    }

    init(){
        this.redemptionSkusModel = new RedemptionSkusModel(this.userId);
        this.pagination  = new Pagination( this.redemptionSkusModel ,{
            beforeRefresh : this.beforeRefresh ,
            onRefresh : this.onRefresh ,
            onRefreshError: this.onRefreshError,
            beforeNext: this.beforeNext,
            onNext: this.onNext,
            onNextError : this.onNextError
        } );
        this.pagination && this.pagination.initPagination();
    }

    _renderItem = ({item, index}) => {
        return (
            <Cell/>
        );
    };

    beforeRefresh = ( ) => {
        this.props.beforeRefresh && this.props.beforeRefresh();
    }

    onRefresh = ( res ) => {
        this.props.onRefresh && this.props.onRefresh();
        this.setState({ list : this.pagination.getList() });
    }

    onRefreshError = ( error ) => {
        this.props.onRefreshError && this.props.onRefreshError();
    }

    beforeNext =() => {
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.pagination.getList() });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
      this.pagination.getNext();
    }

    refresh = () => {
        this.pagination.refresh();
    }
    
    _keyExtractor = ({item, index})=> {
        return `id_${index}`
    }

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    render = () => (<FlatList
                    style={styles.list}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    keyExtractor={this._keyExtractor}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />);
}

export default withNavigation(SkusList);