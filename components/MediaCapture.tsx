import React, { useState, useRef, useEffect } from 'react';

interface MediaCaptureProps {
    onImageCapture?: (imageDataUrl: string) => void;
    onAudioCapture?: (audioBlob: Blob) => void;
}

const MediaCapture: React.FC<MediaCaptureProps> = ({ onImageCapture, onAudioCapture }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hasVideoPermission, setHasVideoPermission] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const audioRef = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        requestMediaPermissions();
    }, []);

    const requestMediaPermissions = async (): Promise<void> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setHasVideoPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            audioRef.current = new MediaRecorder(stream);
        } catch (err) {
            console.error("Error accessing media devices:", err);
            setErrorMsg('Media permissions denied. Please enable camera and microphone access in your browser settings.');
        }
    };

    const sendNotification = async () => {
        try {
            const response = await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Media Captured', body: 'Media has been captured!' }),
            });
            if (!response.ok) throw new Error('Failed to send notification');
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const takePicture = (): void => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const imageDataUrl = canvas.toDataURL('image/jpeg');

            if (onImageCapture) {
                onImageCapture(imageDataUrl);
            }

            sendNotification();
        }
    };

    const toggleAudioRecording = (): void => {
        if (!audioRef.current) return;

        if (isRecording) {
            audioRef.current.stop();
            setIsRecording(false);
            sendNotification();
        } else {
            const audioChunks: Blob[] = [];
            audioRef.current.ondataavailable = (event: BlobEvent) => {
                audioChunks.push(event.data);
            };
            audioRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                if (onAudioCapture) {
                    onAudioCapture(audioBlob);
                }
            };
            audioRef.current.start();
            setIsRecording(true);
        }
    };

    if (errorMsg) {
        return <div className="text-red-500">{errorMsg}</div>;
    }

    if (!hasVideoPermission) {
        return <div>Requesting media permissions...</div>;
    }

    return (
        <div className="space-y-4">
            <video ref={videoRef} autoPlay playsInline className="w-full max-w-md mx-auto border rounded" />
            <div className="flex justify-center space-x-4">
                <button onClick={takePicture} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Take Picture</button>
                <button onClick={toggleAudioRecording} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
        </div>
    );
};

export default MediaCapture;