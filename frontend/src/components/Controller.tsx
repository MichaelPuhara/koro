import axios from 'axios';
import { useState } from 'react';
import RecordMessage from './RecordMessage';
import Title from './Title';

function Controller() {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const createBlobUrl = (data: any) => {
        const blob = new Blob([data], { type: "audio/mpeg" });
        const url = window.URL.createObjectURL(blob);
        return url;
    };

    const handleStop = async (blobUrl: string) => {
        setIsLoading(true);
        // Append recorded message to messages
        const myMessage = { sender: "me", blobUrl };
        const messagesArr = [...messages, myMessage];

        // Convert blob url to blob object
        fetch(blobUrl).then((res) => res.blob()).then(async (blob) => {
            // Construct audio to send file
            const formData = new FormData();
            formData.append("file", blob, "myFile.wav");

            // Send form data to API endpoint
            await axios.post("http://localhost:8000/post-audio", formData, {
                headers: { "Content-Type": "audio/mpeg" },
                responseType: "arraybuffer",
            })
            .then((res: any) => {
                const blob = res.data;
                const audio = new Audio();
                audio.src = createBlobUrl(blob);

                // Append to audio
                const rachelMessage = { sender: "rachel", blobUrl: audio.src };
                messagesArr.push(rachelMessage);
                setMessages(messagesArr);

                // Play Audio
                setIsLoading(false);
                audio.play();
            })
            .catch((err) => {
                console.error(err.message);
                setIsLoading(false);
            });
        });  
    };

    return (
        <div className="h-screen overflow-y-hidden">
            <Title setMessages={setMessages} />
            <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
                {/* Conversation */}
                <div className="mt-5 px-5">
                    {messages.map((audio, index) => (
                        <div key={index + audio.sender} className={"flex flex-col " + (audio.sender === "rachel" ? "items-end" : "")}>
                            {/* Sender */}
                            <div className="mt-4">
                                <p className={audio.sender === "Ōwairaka AI" ? "text-right mr-2 italic text-green-500" : "ml-2 italic text-blue-500"}>
                                    {audio.sender}
                                </p>
                                {/* Audio Message */}
                                <audio src={audio.blobUrl} className="appearance-none" controls />
                            </div>
                        </div>
                    ))}

                    {messages.length === 0 && !isLoading && (
                        <div className="text-center font-light italic mt-10">Send Ōwairaka AI a message...</div>
                    )}

                    {isLoading && (
                        <div className="text-center font-light italic mt-10 animate-pulse">Give me a few seconds...</div>
                    )}
                </div>
                {/* Placeholder for additional content */}
            </div>
            <div className="fixed bottom-0 w-full py-6 border-t text-center bg bg-gradient-to-r from-sky-500 to-green-500">
                <div className="flex justify-center items-center w-full">
                    <RecordMessage handleStop={handleStop} />
                </div>
            </div>
        </div>
    );
}

export default Controller;
