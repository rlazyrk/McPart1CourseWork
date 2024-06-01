import './css/graphsTable.css';
import { useEffect, useState } from "react";
import { fetch100records } from "../../requests";
import {Chart} from "chart.js/auto"
import { Line} from "react-chartjs-2";

function GraphsTable() {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            let records = await fetch100records();
            setData(records.reverse());
            console.log(records);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Додаємо 0 спереду, якщо місяць складається з однієї цифри
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);

        return `${month}-${day} ${hours}:${minutes}`;
    }


    return (
        <div>
            <div className="chart-container">
                <Line
                    data={{
                        labels: data.map((record) => formatTimestamp(record.timeStamp)),
                        datasets: [{
                            label: "Temperature",
                            data: data.map((record) => record.temperature),
                            tension: 0.2,
                            borderColor: 'rgb(180, 10, 10)'
                        }]
                    }}
                    options={{
                        plugins: {
                            legend: {
                                labels: {
                                    font: {
                                        size: 25
                                    },
                                    color: 'rgb(0, 0, 0)'
                                }
                            },
                        },
                        backgroundColor: 'rgb(255, 0, 0)',
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                max: 60,
                                min: 0
                            }
                        }
                    }}
                />
            </div>
            <div className="chart-container">
                <Line
                    data={{
                        labels: data.map((record) => formatTimestamp(record.timeStamp)),
                        datasets: [{
                            label: "Humidity",
                            data: data.map((record) => record.humidity),
                            tension: 0.2,
                            borderColor: 'rgb(10, 10, 180)'
                        }]
                    }}
                    options={{
                        backgroundColor: 'rgb(0, 0, 255)',
                        maintainAspectRatio: false,
                        plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 25
                                },
                                color: 'rgb(0, 0, 0)'
                            }
                        },
                    },
                        scales: {
                            y: {
                                max: 100,
                                min: 0
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default GraphsTable;