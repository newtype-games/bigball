import React from 'react';

const Wager = (props) => {
    let wagerOnVisitor = "-";
    let wagerOnHome = "-";

    let color = (a, b) => {
        if(a > b) return "ui green label";
        else if (a == b && a != "-") return "ui yellow label";
        else return "ui label";
    };

    console.log(props);

    if(typeof(props.guess.wagerOnVisitor) != 'undefined'){
        wagerOnVisitor = props.guess.wagerOnVisitor;
        wagerOnHome = props.guess.wagerOnHome;
    }

    return (
        <div>
            <div className={color(wagerOnVisitor, wagerOnHome)}><b>{wagerOnVisitor}</b></div><br/><br/>
            <div className={color(wagerOnHome, wagerOnVisitor)}><b>{wagerOnHome}</b></div><br/><br/>
        </div>
    );
};


export default Wager;