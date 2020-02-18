import React from 'react';
import { FlatList } from 'react-native';

import Cell from './SkusCell';
import styles from './styles';

export default class SkusList extends React.PureComponent{
    constructor( props ){
        super(props);
        this.state= {
            list: null
        }
    }

    componentDidMount() {
        
    }

    _renderItem = ({item, index}) => {
        return (
            <Cell/>
        );
    };

    getNext =() => {

    }

    refresh = () => {

    }
    
    _keyExtractor = ({item, index})=> {
        return `id_${index}`
    }

    renderFooter =()=> {
            return null;
    }

    render = () => (<FlatList
                    style={styles.list}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.props.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={2}
                />);
}