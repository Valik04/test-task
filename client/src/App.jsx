import React from 'react';
import throttle from './functions/throttle';

import socketIOClient from 'socket.io-client';

import {ReactComponent as Up} from './images/up.svg';
import {ReactComponent as Down} from './images/down.svg';

const ENDPOINT = 'http://127.0.0.1:4000';

function App() {
    const intervalMapping ={
        '5s' : 5000,
        '10s' : 10000,
        '15s' : 15000,
        '20s' : 20000
    }

    const [hide, setHide] = React.useState({});
    const [response, setResponse] = React.useState([]);
    const [userInterval,setUserInterval] = React.useState(intervalMapping['5s'])

    function Listener(data) {
        setResponse(data);
    }

    let wrapperListener = throttle(Listener, userInterval);

    React.useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('start');
        socket.on('ticker', wrapperListener);
        return () => socket.disconnect();
    }, [userInterval]);

    const previousResponse = React.useRef(response);
    React.useEffect(() => {
        previousResponse.current = response;
    }, [response]);

    const getPrevPrice = (i, item) => {
        if (previousResponse.current.length === 0) {
            return item['price'];
        } else {
            return previousResponse.current[i]['price'];
        }
    }

    return (
        <div className='wrapper'>
            <div className='block'>
                <select onChange={(event) =>{
                    setUserInterval(intervalMapping[event.target.value])
                }
                }>
                    <option value='5s'>5s</option>
                    <option value='10s'>10s</option>
                    <option value='15s'>15s</option>
                    <option value='20s'>20s</option>
                </select>
                <h1>Stock</h1>

                <table>
                    <thead>
                    <tr>
                        <th>On/Off</th>
                        <th>Ticker</th>
                        <th>Price</th>
                        <th>Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        response.map((item, i) => {

                                let difference = (item['price'] - getPrevPrice(i, item)).toFixed(2)
                                return (
                                    <tr className={difference >= 0 ? 'rise' : 'fall'} key={i}>
                                        <td>
                                            <label>
                                                <input type='checkbox' onClick={() => {
                                                    hide[i] = !hide[i]
                                                    let copyHide = {...hide}
                                                    setHide(copyHide)
                                                }}/>
                                            </label>
                                        </td>
                                        <td>{item['ticker']}</td>
                                        <td>
                                            <div className={!hide[i] ? "" : 'cell-empty'}>
                                                <span>{item['price']}$</span>
                                                {difference >= 0 ? <Up className='arrow-up'/> :
                                                    <Down className='arrow-down'/>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={!hide[i] ? "" : 'cell-empty'}>{difference}$</div>
                                        </td>
                                    </tr>
                                );
                            }
                        )
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;






