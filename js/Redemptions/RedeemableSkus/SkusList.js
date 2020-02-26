import React from 'react';
import { FlatList, ActivityIndicator, View, Image, Text, TouchableWithoutFeedback } from 'react-native';

import RedemptionSkusModel from "../../services/OstJsonApiPagination/RedemptionSkusModel";
import Pagination from '../../services/OstJsonApiPagination/Pagination';
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import multipleClickHandler from '../MultipleClickHandler';
import OstThemeConfigHelper from '../../helpers/OstThemeConfigHelper';

import styles from './styles';

class SkusList extends React.PureComponent{
    constructor( props ){
        super(props);
        this.pagination = null;
        this.redemptionSkusModel = null ;
        this.state = {
            list: null,
            loadingNext: false,
            refreshing: false
        };
        this.noDataCell = {
            isEmpty: true
        }
    }

    componentDidMount(){
        this.init();
    }

    init(){
        this.redemptionSkusModel = new RedemptionSkusModel(this.props.ostUserId);
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

    onItemClick = (item , index) => {
        this.props.onItemClick && this.props.onItemClick(item , index);
    }

    _renderItem = ({item, index}) => {
        if(item.isEmpty){
            return (<View style={styles.noDataWrapper}>
                        <Text >No items found!!!</Text>
                    </View>);
        }
        let imageUrl = (item.images && item.images.cover && item.images.cover.original.url) || null;
        return (
            <TouchableWithoutFeedback onPress={multipleClickHandler(() => {
                    this.onItemClick(item , index)
                })}
            >
                <View style={styles.itemWrapper}>
                    <View style={styles.item}>
                        {imageUrl && <Image source={{uri: imageUrl }} resizeMode={'cover'} style={{width: '100%', height: '100%'}} />}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    getResults = () => {
        let results = this.pagination.modelFetch.getAllResults();
        return results.length == 0 ? [this.noDataCell] : results;
    }

    beforeRefresh = ( ) => {
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
        this.setState({ refreshing : false, list : this.getResults() });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.getResults() });
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
    
    _keyExtractor = (item, index)=> {
        return `id_${index}`
    }

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };

    render = () => {
        if(!this.state.list) return null;
        return (
                <FlatList
                    style={styles.list}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={ListHeaderComponent}
                />
        )
    }
}


const ListHeaderComponent = (props) => {
    const storeLogo = OstRedemableCustomConfig.getStoreIconUri() , 
            header = OstRedemableCustomConfig.getHeader(),
            description = OstRedemableCustomConfig.getDescription()
      ;
    return (<View styles={styles.headingWrapper}>
        {storeLogo && <Image source={storeLogo} resizeMode={'contain'} style={styles.logoSkipFont}/> }
        {header && <Text style={[styles.title, OstThemeConfigHelper.getH1Config()]}>{header}</Text> }
        {description && <Text style={[styles.description, OstThemeConfigHelper.getH3Config()]}>{description}</Text> }
    </View>)
}

export default SkusList;