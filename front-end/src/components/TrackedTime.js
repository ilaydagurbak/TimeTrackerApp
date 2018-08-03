import React from 'react';
import PropTypes from 'prop-types';
import './styles/TrackedTime.css';

export default class TrackedTime extends React.Component{
    static deafultProps = {
        list:[]
    }

    static propTypes = {
        list:PropTypes.array.isRequired
    }

    constructor(props)
    {
        super(props);
        this.state = {
            render:false,
            reverted:false,
            order:0
        }
        this.ul = null;
        window.addEventListener("resize", this.ReRender.bind(this));
    }

    componentDidMount()
    {
        this.ReRender();
    }

    ReRender()
    {
        this.setState({render:!this.state.render});
    }

    idSort(item1,item2)
    {
        if(item1.id>item2.id)
            return -1;
        else if(item1.id<item2.id)
            return 1;
        return 0 ;
    }

    durationSort(item1,item2)
    {
        if(Number(item1.duration)<Number(item2.duration))
            return -1;
        else if(Number(item1.duration)>Number(item2.duration))
            return 1;
        return 0 ;
    }

    descriptionSort(item1,item2)
    {
        if(item1.description<item2.description)
            return -1;
        else if(item1.description>item2.description)
            return 1;
        return 0 ;
    }

    dateSort(item1,item2)
    {
        if(item1.submitdate.date<item2.submitdate.date)
            return -1;
        else if(item1.submitdate.date>item2.submitdate.date)
            return 1;
        return 0 ;
    }

    changeOrder(order)
    {
        let reverted = false ;
        if(this.state.order === order)
        {
            reverted = !this.state.reverted ;
        }
        else
        {
            reverted = false;
        }
        this.setState({order:order,reverted:reverted});
    }

    render()
    {
        let listHeight = {};
        if(this.ul!=null)
        {
            listHeight = {height:(window.innerHeight-this.ul.offsetTop-30)+'px'};
        }

        let part1 = {width:'10%'};
        let part2 = {width:'20%'};
        let part3 = {width:'40%'};
        let part4 = {width:'30%'};

        let myList = this.props.list;

        switch(this.state.order)
        {
            case 1:
                part2.color='#fe921f';
                myList.sort(this.durationSort);
            break;
            case 2:
                part3.color='#fe921f';
                myList.sort(this.descriptionSort);
            break;
            case 3:
                part4.color='#fe921f';
                myList.sort(this.dateSort);
            break;
            case 0:
            default:
                myList.sort(this.idSort);
                part1.color='#fe921f';
            break;
        }

        let sum = 0 ;

        myList.forEach((item)=>sum+=Number(item.duration));

        if(this.state.reverted)
        {
            myList.reverse();
        }

        return (<div>
            <div onClick={()=>this.changeOrder(0)} className="li-title" style={part1}>Order</div>
            <div onClick={()=>this.changeOrder(1)} className="li-title" style={part2}>Duration (min) total:{Math.floor(sum/(1000*60))}</div>
            <div onClick={()=>this.changeOrder(2)} className="li-title" style={part3}>Description</div>
            <div onClick={()=>this.changeOrder(3)} className="li-title" style={part4}>Submit Date</div>
            <ul style={listHeight} ref={ref=>this.ul=ref}>
                {myList.map((item,index) => <li className={(index%2===0)?"list-1":"list-2"}>
                    <div className="li-parts" style={part1}>{(index+1)}</div>
                    <div className="li-parts" style={part2}>{Math.floor(item.duration/(1000*60))}</div>
                    <div className="li-parts" style={part3}>{item.description}</div>
                    <div className="li-parts" style={part4}>{item.submitdate.date.split(' ')[0]}</div>
                </li>)}
            </ul>
        </div>)
    }
}