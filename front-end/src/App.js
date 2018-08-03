import React from 'react';
import './App.css';
import PropTypes from 'prop-types';
import StopWatch from './components/Stopwatch';
import TrackedTime from './components/TrackedTime';
import axios from 'axios';


export default class App extends React.Component
{
    static defaultProps = 
    {
        domain:null,
        updateInterval:5000//It has to override by the callser component
    }

    static propTypes = 
    {
        domain:PropTypes.string.isRequired,
        updateInterval:PropTypes.number.isRequired
    }

    constructor(props)
    {
        super(props);
        this.state = {
            isCounting:false,
            trackedTime:[],//This is the list of saved items
            mode:0//0: stop watch, 1: input text to save, 2: submited list
        }
        ///This is the current timer id to help you save the user time 
        this.currentTimerId = 0 ;
        this.updatorTimeoutId = 0 ;
        
        this.stopWatchComponent = null ;

        this.lastStopWatchTime = 0 ;
        this.lastDescription = '' ;
    }

    componentDidMount()
    {
        axios.get(this.props.domain+'/api/getLastOpenedDuration')
        .then(this.lastSavedTimeRetuned.bind(this)).catch(
            this.connectionError
        );
    }

    lastSavedTimeRetuned(data)
    {
        if(data.data===null)
        {
           this.startNewRecord();
        }
        else
        {
            this.stopWatchComponent.startFrom(data.data.duration);
            this.currentTimerId = data.data.id ;
            this.lastDescription = data.data.description ;
        }
    }

    //Show the connection error  
    connectionError(error)
    {
        alert(`Connection Error : +${error}`);
    }

   toggleStopWatch()
   {
       this.setState({isCounting:!this.state.isCounting});
        if(this.state.isCounting)
        {
            this.stopWatchComponent.stop();
            this.stopUpdatingServer();
        }
        else
        {
            this.stopWatchComponent.start();
            this.startUpdatingServer();
        } 
   }

   startNewRecord()
   {
        axios.get(`${this.props.domain} /api/insertNewDuration?duration=0`)
        .then(res => {
                        //alert(res.data);
                        if(res.data===0)
                        {
                        alert("Something wrong with the server...") ;
                        return;
                        };
                        this.currentTimerId = res.data;
                        if(this.state.isCounting)
                        {
                            this.startUpdatingServer();
                        }
                    } ).catch(this.connectionError);
   }
    
    startUpdatingServer()
    {
        if(this.updatorTimeoutId!==0 || this.currentTimerId===0)
        {
            console.log(`The server updator is in progress : ${this.updatorTimeoutId} vs ${this.currentTimerId}`);
            return ;
        }
        console.log("Start updating...");
        this.updatorTimeoutId = setTimeout(this.sendCurrentDuration.bind(this),this.props.updateInterval);
    }
        sendCurrentDuration(newDescription,currentTime,submitdone)
        {
            let descriptionPart = '';
            if(newDescription!==undefined)
            {
                descriptionPart = `&description= ${newDescription}`;
            }
            if(currentTime===undefined)
            {
                if(this.stopWatchComponent!==null)
                {
                    currentTime = this.stopWatchComponent.getCurrentTime();
                }
                else{
                    currentTime = this.state.lastStopWatchTime ;
                }
            }

            let submitPart = '' ;
            let onDoneFunction = this.durationUpdateRespond.bind(this);
            if(submitdone===true)
            {
                submitPart = '&submitdone=1';
                onDoneFunction = this.startNewRecord.bind(this);
            }
            console.log(`Update server : ${this.props.domain} api/updateDuration?duration= ${currentTime} &id= ${this.currentTimerId} ${descriptionPart} ${submitPart}`);
            axios.get(`${this.props.domain}/api/updateDuration?duration= ${currentTime} &id= ${this.currentTimerId} ${descriptionPart} submitPart`)
            .then(onDoneFunction)
            .catch(this.connectinError2.bind(this));
        }
        
        connectinError2(res)
        {
            console.log(res);
            if(this.updatorTimeoutId !== 0)//timeout called this function before
            {
                this.updatorTimeoutId = 0 ;
                this.startUpdatingServer();
            }
        }

        durationUpdateRespond(res)
        {
            if(res.data===0)
            {
                console.log("...Connection problem...")
            }
            else
            {
                console.log("Server updated");
            }

            if(this.updatorTimeoutId !== 0)//timeout called this function before
            {
                this.updatorTimeoutId = 0 ;
                this.startUpdatingServer();
            }
        }
    
    stopUpdatingServer()
    {
        if(this.updatorTimeoutId!==0)
        {
            clearTimeout(this.updatorTimeoutId);
            this.updatorTimeoutId = 0 ;
            this.sendCurrentDuration();
        }
    }

   saveUserRecord()
   {
        if(this.stopWatchComponent!==null)
        {
            this.stopWatchComponent.stop();
            this.stopUpdatingServer();
            this.lastStopWatchTime = this.stopWatchComponent.getCurrentTime();
        }

        this.setState({
            isCounting:false,
            lastStopWatchTime:this.lastStopWatchTime,
            lastDescription:this.lastDescription,
            mode:1
        });
   }

   openStopWatch()
   {
        this.setState({
            mode:0
        })
   }

   openTrackedTime()
   {
        if(this.stopWatchComponent!==null)
        {
            this.stopWatchComponent.stop();
            this.lastStopWatchTime = this.stopWatchComponent.getCurrentTime();
        }
        
        this.stopUpdatingServer();

        this.setState({
            isCounting:false,
            lastStopWatchTime:this.lastStopWatchTime,
            lastDescription:this.lastDescription,
            mode:2
        });

        this.setState({trackedTime:null}) ;

        axios.get(`${this.props.domain} /api/getLastDurations`)
            .then(res => this.setState({trackedTime:res.data})).catch(err=>alert(err))
            .catch(this.connectionError);
   }

   resetStopWatch()
   {
        this.lastDescription = '' ;
        this.lastStopWatchTime = 0 ;
        this.sendCurrentDuration(this.lastDescription,this.lastStopWatchTime);
        this.openStopWatch();
        setTimeout(this.sendCurrentDuration.bind(this),0);
   }

    updateAndOpenStopWatch()
    {
        if(this.milToMin(this.state.lastStopWatchTime)!==this.milToMin(this.lastStopWatchTime))
        {
            this.lastStopWatchTime = this.state.lastStopWatchTime ;
        }
        this.lastDescription = this.state.lastDescription ;
        this.sendCurrentDuration(this.state.lastDescription,this.lastStopWatchTime);
        this.openStopWatch();
    }


    saveThisFormAndGoToList()
    {
        if(this.milToMin(this.state.lastStopWatchTime)!==this.milToMin(this.lastStopWatchTime))
        {
            this.lastStopWatchTime = this.state.lastStopWatchTime ;
        }
        this.lastDescription = this.state.lastDescription ;
        this.sendCurrentDuration(this.state.lastDescription,this.lastStopWatchTime,true);
        this.lastDescription = '' ;
        this.lastStopWatchTime = 0 ;
        this.openTrackedTime();
    }

    //Converts miliseconds to minutes 
    milToMin(mil)
    {
        return Math.floor(mil/(1000*60));
    }

    //Converts minutes to miliseconds 
    minToMil(min)
    {
        return Number(min)*1000*60;
    }

    render()
    {

        let stopWatch =  <div>
                            <StopWatch onUnMount={this.stopUpdatingServer.bind(this)} time={this.lastStopWatchTime} ref={ref => this.stopWatchComponent = ref }/>
                            <button onClick={this.toggleStopWatch.bind(this)} className="stop-watch-toggle">{(this.state.isCounting===true)?"STOP":"START"}</button>
                            <button onClick={this.saveUserRecord.bind(this)} className="stop-watch-toggle">Save / Reset</button>
                        </div>;

        let inputText = <div>
                <form>
                    <label>Duration in minutes : </label>
                        <input type="number" name="duration" value={this.milToMin(this.state.lastStopWatchTime)} onChange={(ev)=>this.setState({lastStopWatchTime : this.minToMil(ev.target.value)})}/><br/>
                    <label>Description : </label>
                        <textarea name="descrip" rows="3" value={this.state.lastDescription} onChange={(ev)=>this.setState({lastDescription : ev.target.value})}></textarea><br/>
                </form>
                    <button onClick={this.saveThisFormAndGoToList.bind(this)} className="save-record-button">SAVE</button><br/>
                    <button onClick={this.resetStopWatch.bind(this)} className="stop-watch-toggle">Reset</button>
                    <button onClick={this.updateAndOpenStopWatch.bind(this)} className="stop-watch-toggle">Back</button>
                
            </div>
        

        let notLoadedTrackedTime = <div className="please-wait">Please wait...</div>
        let emptyTrackedTime = <div className="please-wait">No records here.</div>

        let bodyPart ;

        switch(this.state.mode)
        {
            case 1:
                bodyPart = inputText ;
                break;
            case 2:
                if(this.state.trackedTime===null)
                {
                    bodyPart = notLoadedTrackedTime ;
                }
                else if(this.state.trackedTime.length===0)
                {
                    bodyPart = emptyTrackedTime ;
                }
                else
                {
                    bodyPart =  <TrackedTime list={this.state.trackedTime}/> ;
                }
            break;
            case 0:
            default:
                bodyPart = stopWatch;
            break;
        }
        
        let pageHeader = '' ;

        switch(this.state.mode)
        {
            case 1:
            case 0:
                pageHeader = 'Time Tracker' ;
                break;
            case 2:
                pageHeader = 'History' ;
            break;
            default:
            break;
        }

        return(
            <div className="non">
                <div className="headersection"><h1>{pageHeader}</h1></div>
                <button onClick={this.openStopWatch.bind(this)} className="main-button">Time Tracker</button>
                <button onClick={this.openTrackedTime.bind(this)} className="main-button">History</button>
               
                {bodyPart}
            </div>
        );
    }
}