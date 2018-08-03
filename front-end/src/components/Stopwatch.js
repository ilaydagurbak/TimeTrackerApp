import React from 'react';
import PropTypes from 'prop-types';
import './styles/Stopwatch.css';


export default class StopWatch extends React.Component
{
    static defaultProps = {
        time:0,
        interval:100,
        blinkColor:'#fe921f',
        onUnMount:null
    }

    static propTypes = {
        time:PropTypes.number,
        interval:PropTypes.number,
        blinkColor:PropTypes.string,
        onUnMount:PropTypes.func
    }

    constructor(props)
    {
        super(props);

        this.day = 0 ;
        this.hour = 0 ;
        this.min = 0 ;
        this.sec = 0 ;
        this.mil = 0 ;

        /**0 only miliseconds, 1 seconds, 2 minutes, 3 hours, 4 days */
        this.level = 0 ;

        this.separator = ':' ;

        this.state = {
            time:this.props.time
        }

        this.splitTimeInStrings();

        window.addEventListener("resize", this.ReRender.bind(this));
    }

    getCurrentTime()
    {
        return Number(this.state.time) ;
    }

    startFrom(newTime)
    {
        this.setState({time : Number(newTime)}) ;

    }

    componentWillUnmount()
    {
        if(this.props.onUnMount!==undefined)
        {
            this.props.onUnMount();
        }
        this.stop();
    }

    componentDidMount() {
        window.addEventListener('load', this.ReRender.bind(this));
     }

    splitTimeInStrings()
    {
        let insecond = Math.floor(this.state.time/1000);
        let inminutes = Math.floor(insecond/60);
        let inhoure = Math.floor(inminutes/60);

        
        this.day = Math.floor(inhoure/24);
        this.hour = inhoure%24 ;
        this.min = inminutes%60 ;
        this.sec = insecond%60 ;
        this.mil = this.state.time%1000 ;

        if(this.day>0)
        {
            this.level=4;
        }
        else if(this.hour>0)
        {
            this.level=3;
        }
        else if(this.min>0)
        {
            this.level=2;
        }
        else if(this.sec>0)
        {
            this.level=1;
        }

        //alert('day : '+this.day+' hour : '+this.hour+' min : '+this.min+' sec : '+this.sec+' mil : '+this.mil);
    }

        /**milisecond part */
        showMiliSecondPart()
        {
            return '.'+Math.floor(this.mil/100);
        }

        showSecondPart()
        {
            return this.numToString(this.sec);
        }

        showMinutesPart()
        {
            return (this.level>=2)?this.numToString(this.min):'';
        }

        showMinutesSeparator()
        {
            return (this.level>=2)?this.separator:'';
        }

        showHourePart()
        {
            return (this.level>=3)?this.numToString(this.hour):'';
        }

        showHoureSeparator()
        {
            return (this.level>=3)?this.separator:'';
        }

        showDayPart()
        {
            return (this.level===4)?this.day:'';
        }

        showDaySeparator()
        {
            return (this.level===4)?this.separator:'';
        }

        /**Takes number and returns string in the 2 characters format : 1 -> '01' , 32 -> '32' */
        numToString(num)
        {
            num = num.toString();
            if(num.length===1)
            {
                return '0'+num ;
            }
            else
            {
                return num ;
            }
        }


    stop()
    {
        clearInterval(this.intervalId);
    }

    start()
    {
        this.startDate = Date.now() ;
        this.initTime = this.state.time ;
        this.intervalId = setInterval(this.incraeseTime.bind(this),this.props.interval);
    }

        incraeseTime()
        {
            //console.log("typeof : "+typeof(this.state.time))
            this.setState({
                time:Number(this.initTime)+Number(Date.now()-this.startDate)
            });
            //console.log("this.state.time : "+this.state.time);
        }


        ReRender()
        {
            this.setState({
                rerender:!this.state.rerender
            })
        }

    render()
    {
        this.splitTimeInStrings();

        const fadeCSS = 'sotp-watch-fade';
        const fadeInCSS = 'stop-watch-fade-in';

        let minStyle = (this.level>1)?fadeInCSS:fadeCSS;
        let houreStyle = (this.level>2)?fadeInCSS:fadeCSS;
        let dayStyle = (this.level>3)?fadeInCSS:fadeCSS;

        let stopWatchPose = {};
        if(this.textBody!==undefined)
        {
            stopWatchPose.paddingRight = (this.mainStopWatchBody.offsetWidth-this.textBody.offsetWidth)/2+'px';
        }
        else
        {
            setTimeout(this.ReRender.bind(this),0);
            stopWatchPose.opacity = -10 ;
        }
       
        console.log("minStyle : "+minStyle+' vs '+this.level)
        return(
            <div className="stop-watch" style={stopWatchPose} ref={ref => this.mainStopWatchBody = ref}><b ref={ref => this.textBody = ref}>
                <span className={dayStyle}>{this.showDayPart()+this.showDaySeparator()}</span>
                <span className={houreStyle}>{this.showHourePart()+this.showHoureSeparator()}</span>
                <span className={minStyle}>{this.showMinutesPart()+this.showMinutesSeparator()}</span>
                <span>{this.showSecondPart()}</span>
                <span className="milisecond-part">{this.showMiliSecondPart()}</span> </b>
            </div>
        );
    }
}