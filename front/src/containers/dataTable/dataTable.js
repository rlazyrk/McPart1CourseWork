import React, {useState, useEffect} from 'react';
import {fetch10recordsUP, fetchLast10records} from '../../requests';
import './css/dataTable.css'

const DataTable = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [minId, setMinId] = useState(null);
    const [maxId, setMaxId] = useState(null);
    const [fetchDirection, setFetchDirection] = useState('forward');
    const [statusMessage, setStatusMessage] = useState(null)

    const getStatusMessage = () => {
        if (data.length === 0) {
            return "No data.";
        } else if (currentPage > 1){
            return "Sensor data history";
        } else if (data.some(record => record.isFire)) {
            return "WARNING! Smoke detected!";
        } else if (data.some(record => record.temperature > 40)) {
            return "WARNING! High temperature!";
        } else if (data.some(record => record.humidity < 40)) {
            return "WARNING! Low humidity!";
        }
    };

    useEffect(() => {
        const newStatusMessage = getStatusMessage();
        setStatusMessage(newStatusMessage);
    }, [data]);

    const fetchData = async () => {
        try {
            let records;
            if (fetchDirection === 'forward') {
                records = await fetchLast10records(minId);
            } else {
                records = await fetch10recordsUP(maxId+1);
            }

            setData(records);

            if (records.length > 0) {
                const minIdValue = Math.min(...records.map(record => record.id));
                setMinId(minIdValue);
                const maxIdValue = Math.max(...records.map(record => record.id));
                setMaxId(maxIdValue);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, fetchDirection]);

    useEffect(() => {
        if (currentPage === 1) {
            const intervalId = setInterval(fetchData, 120000);

            return () => clearInterval(intervalId);
        }
    }, [currentPage, fetchDirection]);

    const handleNextPage = () => {
        setFetchDirection('forward');
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setFetchDirection('backward');
        setCurrentPage(prevPage => prevPage - 1);
    };

    return (
        <div>
            <div className={'status'}>{statusMessage}</div>
            <div className={'table_box'}>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Sensor address</th>
                    <th>Humidity</th>
                    <th>Temperature</th>
                    <th>Smoke detected</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(data) && data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.id}</td>
                        <td>{new Date(row.timeStamp).toLocaleString()}</td>
                        <td>{row.mcAddress}</td>
                        <td style={{backgroundColor: row.humidity < 40 ? 'orange' : 'inherit' }} >{row.humidity}</td>
                        <td style={{backgroundColor: row.temperature > 40 ? 'orange' : 'inherit' }}>{row.temperature}</td>
                        <td style={{backgroundColor: row.isFire  ? 'red' : 'inherit' }} >{row.isFire ? 'YES' : 'NO'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className={'button_box'}>
                <button className={'table_button'} onClick={handlePrevPage} disabled={currentPage === 1}>Previous page</button>
                <button className={'table_button'} onClick={handleNextPage}>Next Page</button>
            </div>
        </div>
    );
};

export default DataTable;
