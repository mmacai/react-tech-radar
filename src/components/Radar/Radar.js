import React, {Component} from 'react';
import * as d3 from "d3";
import {RadarContents, QuadrantGroup} from "./Radar.style";

import Quadrant from "../Quadrant/Quadrant";
import Item from "../Item/Item";

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
export const ThemeContext = React.createContext(colorScale);

class Radar extends Component {

    //get theme from global context
    static contextType = ThemeContext;

    constructor(props) {
        super(props);
        const angle = 360 / this.props.quadrants.length;
        const points = this.processRadarData(this.props.quadrants, this.props.horizons, this.props.data);

        //create ref
        this.myRef = React.createRef();

        this.state = {
            angle: angle,
            points: points
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <RadarContents
                width={this.props.width}
                height={this.props.width}
                ref={el => this.myRef = el}>
                <g transform={"translate(" + this.props.width / 2 + "," + this.props.width / 2 + ")"}>
                    <QuadrantGroup>
                        {this.props.quadrants.map((value, index) => {
                            //if (index = 3)    //zoom trial
                            return <Quadrant
                                width={this.props.width}
                                key={index}
                                index={index}
                                horizons={this.props.horizons}
                                angle={this.state.angle}
                                name={value}
                                fontSize={this.props.fontSize}
                            />
                        })}
                    </QuadrantGroup>
                    {this.state.points.map((value, index) => <Item key={index} data={value}/>)}
                </g>

            </RadarContents>
        )
    }

    processRadarData = (quadrants, horizons, data) => {

        // go through the data
        const results = [];

        for (let i in data) {
            const entry = data[i];

            let quadrant_delta = 0;

            // figure out which quadrant this is
            const angle = 2 * Math.PI / this.props.quadrants.length;
            for (let j = 0, len = quadrants.length; j < len; j++) {
                if (quadrants[j] === entry.quadrant) {
                    quadrant_delta = angle * j;
                }
            }

            const randomPosition = this.getPositionByQuadrant(horizons, entry);
            const positionAngle = Math.random();
            const horizonWidth = 0.95 * this.props.width / 2;

            //theta is the position in the quadrant
            const theta = (positionAngle * angle) + quadrant_delta;
            const r = randomPosition * horizonWidth;
            const cart = this.polarToCartesian(r, theta);
            const blip = {
                id: i,
                name: entry.name,
                x: cart[0],
                y: cart[1]
            };

            results.push(blip);
        }
        return results;
    };

    polarToCartesian = (r, t) => {
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        return [x, y];
    };

    getPositionByQuadrant = (horizons, history) => {
        const horizonCount = horizons.length;
        const margin = (1 / horizonCount * 0.1);
        const horizonIndex = horizons.indexOf(history.horizon);
        const posStart = (1 / horizonCount * horizonIndex) + margin;
        const posLength = Math.abs((Math.random() / horizonCount) - (margin * 2));
        return posStart + posLength;
    };
}

export default Radar;
