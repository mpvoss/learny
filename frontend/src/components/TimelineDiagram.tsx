// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Paper } from '@mui/material';
import { TimelineDiagramData } from '../models';

const TimelineDiagram: React.FC<TimelineDiagramData> = (diagram) => {
    const ref = useRef(null);


    function generateColors(n: number): string[] {
        const colors: string[] = [];
        const saturation = 100; // full saturation
        const lightness = 50; // middle lightness
        const hueStep = 360 / n; // divide hue into n steps

        for (let i = 0; i < n; i++) {
            const hue = hueStep * i; // calculate hue for each color
            colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
        }

        return colors;
    }

    function formatDate(date: Date): string {
        const year = date.getFullYear();
        if (year < 0) {
            return `${Math.abs(year)} BCE`;
        } else {
            return `${year} CE`;
        }
    }

    useEffect(() => {

        if (!diagram || ref.current === null) {
            return;
        }

        const diagramCopy = diagram.data.events;
        let dataraw = diagramCopy.sort((a, b) => b.start_year - a.start_year);

        const regions = Array.from(new Set(dataraw.map(item => item.region)));
        const colors = generateColors(regions.length);
        const regionColorMap = regions.reduce((map, region, index) => {
            map[region] = colors[index];
            return map;
        }, {});

        const data = dataraw.map(item => ({
            event: item.name,
            startDate: new Date(item.start_year, 0, 1),
            endDate: new Date(item.end_year, 11, 31),
            regionColor: regionColorMap[item.region],
            region: item.region
        }));


        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // clear the SVG

        const margin = { top: 20, right: 20, bottom: 30, left: 250 };
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width - margin.left - margin.right;
        const height = rect.height - margin.top - margin.bottom;

        const minDate = d3.min(data, d => d.startDate);
        const maxDate = d3.max(data, d => d.endDate);

        const x = d3
            .scaleTime()
            .domain([minDate, maxDate])
            .range([0, width]);

        const y = d3
            .scalePoint()
            .domain(data.map(d => d.event))
            .range([height, 0]);

        const xAxis = d3.axisBottom(x)
            .tickFormat(d => {
                const year = d.getFullYear();
                return `${Math.abs(year)} ${year < 0 ? 'BCE' : 'CE'}`;
            });



        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width + margin.left - 200}, ${margin.top})`);

        const legendItems = legend.selectAll('.legend-item')
            .data(regions)
            .enter().append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legendItems.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d => regionColorMap[d]);

        legendItems.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(d => d);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        g.append('g')
            .call(d3.axisLeft(y));

        
        g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('fill', d => d.regionColor)
            .attr('x', d => x(d.startDate))
            .attr('y', d => y(d.event) - 20)
            .attr('width', d => x(d.endDate) - x(d.startDate))
            .attr('height', 20)
            .append('title') // append a title element to the bar
            .text(d => `Name: ${d.event}\nYear Range: ${formatDate(d.startDate)} - ${formatDate(d.endDate)}\nRegion: ${d.region}`);

    }, [diagram]);

    return (<div  >
        <Paper elevation={5} style={{    marginTop: "10px",
    marginBottom: "10px",}}>
        <svg ref={ref} width="100%" height="500"  /> 
        </Paper>
        </div>);
};

export default TimelineDiagram;