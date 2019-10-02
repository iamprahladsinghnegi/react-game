import React, { Component } from 'react';
import {Row, Col} from 'antd';
import 'antd/dist/antd.css'
import './index.scss'

class Square extends Component {
    constructor(props){
        super(props);
        this.state={

        }
    }
    render() { 
        return (  
            <div className='square' style={{backgroundColor: this.props.backgroundColor}}>
                {this.props.value}
            </div>
        );
    }
}
 
export default Square;