import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {connect} from 'react-redux';
import * as utils from '../../utils/filtering';
import * as dates from '../../utils/date';
import _ from 'lodash';
import * as drops from '../../utils/dropdown';
import PointsLabel from '../Utils/PointsLabel';
import DropDown from '../Utils/DropDown';
import Match from '../Utils/Match';
import Wager from '../Utils/Wager';
import ProgressMatchBar from '../Utils/ProgressMatchBar';
import * as actions from '../../actions/MyGameActions';

const showModal = (match) => {
    return typeof(match.stageIndex) != 'undefined';
};

const checked = (stageDouble, currentId) => {
    return stageDouble === currentId;
};

const isEdit = (id, authId) => {
    return id === authId;
};

class MyGameFormPhaseListWinnerOnly extends Component {
    constructor(props, context){
        super(props, context);

        this.handleHide = this.handleHide.bind(this);
        this.saveAndExit = this.saveAndExit.bind(this);
        this.selectMatch = this.selectMatch.bind(this);
        this.moveMatchModal = this.moveMatchModal.bind(this);
    
        this.state = {
          match: {},
          alertStages: { id:"", msgDouble:"", msgMatches:""},
          alertWinner: ""
        };
   }

    // STATE METHODS
    handleHide() {
        this.setState({ match: {} });
    }

    saveAndExit() {
        if(this.validateWinnerGuess()){
            this.handleMatchSubmit();
            this.props.fetchGuess(this.props.id);
            this.setState({ match: {} });
        }else{
            alert("Por favor preencher todos os campos antes de sair");
        }
    }

    selectMatch(id,e){
        let stageId = id.split(";")[0];
        let matchId = id.split(";")[1];
        e.preventDefault();
        if(this.props.guess.stageGuesses[stageId].status == "opened" && isEdit(this.props.id, this.props.auth._id)){
            this.setState({
                match: {
                    stageIndex:stageId, 
                    matchIndex:matchId, 
                    guess:this.props.guess.stageGuesses[stageId].matchGuesses[matchId]
                }
            });
        }
    }

    selectedDoubleMatch(id,e){
        let value = {_id:id, doubleMatch: e.target.value};
        this.props.saveDouble(value);
        this.props.fetchGuess(this.props.id);
        this.setState({double:e.target.value});
        alert("Você alterou a partida que vale o dobro dos pontos!");
    }

    validateWinnerGuess(){
        if(this.txtWagerOnHome == null || this.txtWagerOnHome.value == ""){
            console.error("txtWagerOnHome not valid");
            return false;
        }

        if(this.txtWagerOnVisitor == null || this.txtWagerOnVisitor.value == ""){
            console.error("txtWagerOnVisitor not valid");
            return false;
        }

        return true;
    }

    moveMatchModal(val){
        if(this.validateWinnerGuess()){
            // update the current guess
            this.handleMatchSubmit();

            // move to previous or next guess
            let stageId = this.state.match.stageIndex;
            let matchId = this.state.match.matchIndex;
            let total = this.props.guess.stageGuesses[stageId].matchGuesses.length;
            let newMatchId = parseInt(matchId) + parseInt(val);

            if(newMatchId >= 0 && newMatchId < total){
                let guess = this.props.guess.stageGuesses[stageId].matchGuesses[newMatchId];
                if(typeof(guess.guess.homeScore) == 'undefined') guess.guess.homeScore = "";
                if(typeof(guess.guess.visitorScore) == 'undefined') guess.guess.visitorScore = "";

                this.txtVisitScore.value = guess.guess.visitorScore;
                this.txtHomeScore.value = guess.guess.homeScore;

                this.setState((state) => {
                    return {
                        match: {
                            stageIndex:stageId, 
                            matchIndex:newMatchId, 
                            guess: guess
                        }
                    };
                });
            }
        }else{
            alert("Por favor preencher todos os campos antes de movimentar");
        }
    }

    handleMatchSubmit(){
        let guessToUpdate = this.state.match.guess;
        guessToUpdate.winnerGuess.wagerOnHome = this.txtWagerOnHome.value;
        guessToUpdate.winnerGuess.wagerOnVisitor = this.txtWagerOnVisitor.value;
        this.props.saveGuess(guessToUpdate);
    }

    onChangeScore(value, field){
        let stateToChange = this.state.match;
        if(field === "home") stateToChange.guess.guess.homeScore = value;
        else stateToChange.guess.guess.visitorScore = value;
        this.setState({match: stateToChange});
    }

    onChangeWinnerWager(value, field) {
        let stateToChange = this.state.match;
        if(field === "home") stateToChange.guess.winnerGuess.wagerOnHome = value;
        else stateToChange.guess.winnerGuess.wagerOnVisitor = value;
        this.setState({ match: stateToChange });
    }

    disableButtonModal(btn){
        if(btn === "pre"){
            if(this.state.match.matchIndex === 0) return true;
            else return false;
        }else{
            if(this.state.match.matchIndex + 1 === this.props.guess.stageGuesses[this.state.match.stageIndex].matchGuesses.length) return true;
            else return false;
        }
    }

    modalStageName(){
        if(showModal(this.state.match)){
            let index = this.state.match.stageIndex;
            return this.props.guess.stageGuesses[index].label;
        }
        return "";
    }
    
    // RENDER METHODS
    RenderResult(match){
        if(match.result.homeScore != null){
            return(
                <Wager guess={match.result} teams={match}/>
            );
        }else{
            return(<div>Não disponível</div>);
        }
    }

    RenderMatches(stage, ind){
        let children = [];

        for(let i=0; stage.matchGuesses != null && i < stage.matchGuesses.length; i++){
            let match = stage.matchGuesses[i];

            children.push (
                <tr key={i}>
                    <td width="10%" style={{textAlign:"center"}}>
                        {
                            isEdit(this.props.id, this.props.auth._id) && 
                            stage.status == "opened" && 
                            <input type="radio" 
                                onClick={this.selectedDoubleMatch.bind(this, stage._id)} 
                                name="rbDouble" 
                                value={match.relatedMatch} 
                                defaultChecked={checked(stage.doubleMatch, match.relatedMatch)} 
                            />
                        }
                        {
                            stage.status != "opened" && checked(stage.doubleMatch, match.relatedMatch) && 
                            <i className="icon arrow alternate circle right"></i>
                        }
                    </td>
                    <td onClick={this.selectMatch.bind(this, `${ind};${i}`)}>
                        <Match match={match} teams={this.props.teams} />
                    </td>
                    <td onClick={this.selectMatch.bind(this, `${ind};${i}`)}>
                        <Wager teams={match} guess={match.winnerGuess}/>
                    </td>
                    <td onClick={this.selectMatch.bind(this, `${ind};${i}`)}>
                        {this.RenderResult(match)}
                    </td>
                    <td onClick={this.selectMatch.bind(this, `${ind};${i}`)}>{match.group}<br/>{dates.getDate(match.date)}</td>
                    <td onClick={this.selectMatch.bind(this, `${ind};${i}`)} width="10%"><PointsLabel value={match.points} /></td>
                </tr>           
            );
        }

        return children;
    }

    RenderAlertStagesMatches(stage){
        let arr = _.filter(stage.matchGuesses, match => {
            return typeof(match.guess.visitorScore) == 'undefined' || typeof(match.guess.homeScore) == 'undefined'
        });

        if(arr.length > 0)
            return (
                <p className="text-danger text-right"><b>* Atenção!</b> Você não preencheu todos os jogos dessa fase</p>
            );
        else
            return (<br />)
    }

    RenderAlertStagesDouble(stage){
        if(stage.doubleMatch == null || stage.doubleMatch == ""){
            return (
                <p className="text-danger text-right"><b>* Atenção!</b> Você não selecionou a partida que vale o dobro</p>
            );
        }
        else
        {
            let match = _.find(stage.matchGuesses, {"relatedMatch":stage.doubleMatch});
            let visitor = utils.filterCountry(match.visitorTeam, this.props.teams)[0];
            let home = utils.filterCountry(match.homeTeam, this.props.teams)[0];

            return (
                <div>
                    <p className="text-right"><b>Jogo dobra:</b> <img src="/assets/flags/blank.gif" className={visitor.flag} /> {visitor.name} vs <img src="/assets/flags/blank.gif" className={home.flag} /> {home.name} (grupo {match.group}, {dates.getDate(match.date)}) - <PointsLabel value={stage.pointsDoubleMatch} /></p>
                </div>
            );
        }
    }

    RenderStages(){
        let stages = this.props.guess.stageGuesses;
        let stagesDom = [];

        for(let i=0; i < stages.length; i++){
            let stage = stages[i];

            if(stage.matchGuesses.length > 0){
                stagesDom.push(
                    <div key={i}>
                        <div className="ui segment">
                            {this.RenderAlertStagesMatches(stage)}
                            <h4 className="ui horizontal divider header">
                                <i className="futbol icon"></i> {stage.label} - encerra em {dates.getDateTime(stage.deadline)}
                            </h4>
                            <br/>
                            {this.RenderAlertStagesDouble(stage)}
                            <br/>
                            <div>
                                <table className="ui small selectable table">
                                    <thead>
                                        <tr>
                                            <th>Dobra?</th>
                                            <th colSpan="2">Seu palpite</th>
                                            <th>Resultado oficial</th>
                                            <th>Partida</th>
                                            <th>Pontos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.RenderMatches(stage, i)}
                                    </tbody>
                                </table> 
                            </div>
                        </div>
                    </div>
                );
            }
        }

        return stagesDom;
    }

    renderModal(){
        if(showModal(this.state.match)){
            return(
                <Modal
                show={showModal(this.state.match)}
                onHide={this.handleHide}
                bsSize="sm"
                dialogClassName="custom-modal"
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">
                    <i className="futbol icon"></i> {this.modalStageName()}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProgressMatchBar state={this.state.match} stages={this.props.guess.stageGuesses} />
                    <hr/>
                    <p>Informe seu palpite:</p>
                    <table className="ui table">
                        <tbody>
                        <tr>
                            <td style={{verticalAlign:"middle"}}><Match match={this.state.match.guess} teams={this.props.teams} /></td>
                            <td style={{verticalAlign:"middle"}}>
                                <div>
                                    <form ref={form => {this.frmMatch = form}}>
                                    <input onInput={e => this.onChangeWinnerWager(e.target.value, "visitor")} ref={input => {this.txtWagerOnVisitor = input}} style={{width:"80px"}} type="number" min={0} defaultValue={this.state.match.guess.winnerGuess.wagerOnVisitor} className="ui input" /><br/><br/>
                                    <input onInput={e => this.onChangeWinnerWager(e.target.value, "home")} ref={input => {this.txtWagerOnHome = input}} style={{width:"80px"}} type="number" min={0} defaultValue={this.state.match.guess.winnerGuess.wagerOnHome} className="ui input" /><br/><br/>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <hr/>        
                    <button disabled={this.disableButtonModal("pre")} className="ui button" onClick={this.moveMatchModal.bind(this, -1)}><i className="icon angle double left"></i> Anterior</button>
                    <button disabled={this.disableButtonModal("nex")} className="ui button" onClick={this.moveMatchModal.bind(this, 1)}>Proximo <i className="icon angle double right"></i></button>
                    <br/><br/><button className="ui blue button" onClick={this.saveAndExit}><i className="icon save"></i> Salvar e Sair</button>
                </Modal.Body>
                </Modal>
            );
        }else{
            return (<div></div>);
        }
    }

    render(){
        return(
            <div>
                {this.RenderStages()}
                {this.renderModal()}
            </div>
        );
    }
}

function mapStateToProps({guess, teams, auth}){
    return {guess, teams, auth};
}

export default connect(mapStateToProps, actions)(MyGameFormPhaseListWinnerOnly);