import React, { Component, MouseEvent } from "react";
import { Guest, fromJson } from "./GuestType";
import { isRecord } from "./record";

type GuestListProps = {
    onOpenAG: () => void;
    onOpenG: (name: string) => void;
}

type GuestListState = {
    guests: unknown[] | undefined;
    Brideg: {total: number, family: number, extra: number} | undefined; //extra is the number of undefined plusones
    Groomg: {total: number, family: number, extra: number} | undefined;
}

export class GuestList extends Component<GuestListProps, GuestListState> {
    constructor(props: GuestListProps) {
        super(props);
        this.state = {guests: undefined, Brideg: undefined, Groomg: undefined}
    }

    render = (): JSX.Element => {
        if(this.state.guests === undefined) {
            this.doUpdateListChange();
            return <div>LOADING...</div>
        }
        if(this.state.Groomg === undefined || this.state.Brideg === undefined) {
            this.doUpdateGuestCountChange(0, {total: 0, family: 0, extra: 0}, {total: 0, family: 0, extra: 0})
            return <div>LOADING...</div>
        }
        return <div>
            <div><h1>Guest List</h1></div>
            <div>{this.renderList([], 0)}</div>
            <div><h2>Summary</h2></div>
            <div>{this.state.Brideg.total}{(this.state.Brideg.extra===0) ? " " : "-"+(this.state.Brideg.total + this.state.Brideg.extra)+" "}
                guest(s) of Bride ({this.state.Brideg.family} family)</div>
            <div>{this.state.Groomg.total}{(this.state.Groomg.extra===0) ? " " : "-"+(this.state.Groomg.total + this.state.Groomg.extra)+" "}
                guest(s) of Groom ({this.state.Groomg.family} family)</div>
            <div><button onClick={this.doOpenAddGuestClick}>Add Guest</button></div>
        </div>
    }

    renderList = (html: JSX.Element[], index: number): JSX.Element => {
        if(this.state.guests === undefined){
            throw new Error("Couldn't fetch guests")
        }
        if(html.length === this.state.guests.length){
            return <ul>{html}</ul>
        }
        const guest: Guest = fromJson(this.state.guests[index])
        if(guest.info.plusone === undefined){
            html.push(<li key={index}><a href="#" onClick={this.doOpenGuestInfoClick}>{guest.name}</a> Guest of {guest.info.host} +1?</li>)
        }
        else {
            html.push(<li key={index}><a href="#" onClick={this.doOpenGuestInfoClick}>{guest.name}</a> Guest of {guest.info.host} +{guest.info.plusone}</li>)
        }
        return this.renderList(html, index+1)
    }

    doUpdateGuestCountChange = (i: number, mg: {total: number, family: number, extra: number}, 
        jg: {total: number, family: number, extra: number}): 1 => {
        if(this.state.guests === undefined){
            throw new Error("no guests fetched yet")
        }
        if(i === this.state.guests.length){
            this.setState({Brideg: mg, Groomg: jg})
            return 1;
        }
        else{
            const g: Guest = fromJson(this.state.guests[i]);
            if(g.info.host === "Groom"){
                const newtotal: number = (g.info.plusone===1) ? jg.total + 2 : jg.total + 1;
                const newfam: number = (g.info.isFamily) ? jg.family + 1 : jg.family;
                const newextra: number = (g.info.plusone===undefined) ? jg.extra + 1 : jg.extra;
                return this.doUpdateGuestCountChange(i+1, mg, {total: newtotal, family: newfam, extra: newextra})
            }
            else{
                const newtotal: number = (g.info.plusone===1) ? mg.total + 2 : mg.total + 1;
                const newfam: number = (g.info.isFamily) ? mg.family + 1 : mg.family;
                const newextra: number = (g.info.plusone===undefined) ? mg.extra + 1 : mg.extra;
                return this.doUpdateGuestCountChange(i+1, {total: newtotal, family: newfam, extra: newextra}, jg)
            } 
        }
    }

    doOpenAddGuestClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onOpenAG();
    }

    doOpenGuestInfoClick = (evt: MouseEvent<HTMLAnchorElement>): void => {
        if(!(evt.target instanceof HTMLAnchorElement)){
            return;
        }
        this.props.onOpenG(evt.target.innerHTML);
    }

    doUpdateListChange = (): void => {
        fetch("/api/values")
          .then((res) => this.doListResp(res))
          .catch(() => this.doListError("failed to connect to server"));
    }
    
    doListResp = (res: Response): void => {
        if (res.status === 200) {
            res.json().then((val) => this.doListJson(val))
            .catch(() => this.doListError("200 response is not JSON"));
        } else if (res.status === 400) {
            res.text().then(this.doListError)
            .catch(() => this.doListError("400 response is not text"));
        } else {
            this.doListError(`bad status code: ${res.status}`);
        }
    };
    
    doListJson = (val: unknown): void => {
        if (!isRecord(val) || !Array.isArray(val.values)) {
            console.error('Invalid JSON from /api/values', val);
            return;
        }
        
        const guests: unknown[] = [];
        for (const guest of val.values) {
            if (Array.isArray(guest)) {
                guests.push(guest);
            } else {
                console.error('Invalid name from /api/values', guest);
                return;
            }
        }
        
        this.setState({guests: guests})
    };

    doListError = (msg: string): void => {
        console.error(`Error fetching /api/values: ${msg}`);
    };
}
