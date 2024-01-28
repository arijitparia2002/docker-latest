import React from 'react'
import io from 'socket.io-client'
import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography';


const socket = io.connect('http://localhost:3001') // Connect to the server

const Message = () => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState(null)
    const [recivedMessage, setRecivedMessage] = useState(null)

    // Send the message to the server
    const sendMessage = () => {
        socket.emit('chat_message', { message })
        setMessages((messages) => [...messages, { msg: message, isMine: true }])
        setMessage('')

    }

    // Handle the Enter key to send the message
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    // Recieve the message from the server
    useEffect(() => {
        socket.on('recieve_message', (data) => {
            setRecivedMessage(data.message)
        })

        return () => {
            socket.off()
        }
    }, [])

    // Update the messages array when recieve a message
    useEffect(() => {
        if (recivedMessage) {
            setMessages((messages) => [...messages, { msg: recivedMessage, isMine: false }])
            setRecivedMessage(null)
        }

    }, [recivedMessage])

    return (
        <div className='flex flex-col w-2/3 h-screen my-1 justify-center'>
            <div className='items-center flex flex-col bg-gray-50 h-5/6 rounded-lg pb-2'>
                <h3 className='text-2xl font-bold bg-blue-500 px-2 py-1 rounded rounded-b-none w-full text-center'>QChat Messages</h3>
                <div className='flex-grow p-4 overflow-y-auto w-full'>
                    {

                        messages.map((message, index) => {
                            return (
                                <Typography variant="caption">
                                <div key={index} className={` border border-solid text-justify px-4 p-2 shadow shadow-slate-400 my-4 w-1/4 rounded-2xl text-lg ${message.isMine ? 'ml-auto rounded-br-none bg-blue-200 bg-opacity-50 border-gray-400' : 'rounded-bl-none border-blue-400 '
                                    }`}>
                                    {message.msg}
                                </div>
                                </Typography>  
                            )
                        }
                        )
                    }
                </div>
                <div className='flex flex-row w-full items-center px-2'>
                    <input type="text" placeholder='Messege...' className='flex-grow p-4 bg-blue-100 rounded-l-lg' onChange={(event) => setMessage(event.target.value)} onKeyDown={handleKeyDown} value={message}/>
                    <button onClick={sendMessage} className=' ml-1 px-4 py-4 bg-blue-400 rounded-r-lg hover:bg-blue-500 font-bold'
                        disabled={!message}
                    >Send Messege</button>
                </div>
            </div>
        </div>
    )
}

export default Message
