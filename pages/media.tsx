import Head from 'next/head'
import Image from 'next/image'
import MediaCapture from '../components/MediaCapture'
import PushSubscription from '../components/PushSubscription'
import { NextPage } from 'next'
import { useState } from 'react'

const MediaPage: NextPage = () => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleImageCapture = (imageDataUrl: string) => {
        setCapturedImage(imageDataUrl);
    };

    const handleAudioCapture = (audioBlob: Blob) => {
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Head>
                <title>Media Capture - My PWA</title>
                <meta name="description" content="Media capture page for My PWA" />
            </Head>

            <main>
                <h1 className="text-3xl font-bold mb-6">Media Capture</h1>
                <PushSubscription />
                <MediaCapture onImageCapture={handleImageCapture} onAudioCapture={handleAudioCapture} />

                {capturedImage && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Captured Image:</h2>
                        <Image src={capturedImage} alt="Captured" width={400} height={300} />
                    </div>
                )}

                {audioUrl && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Recorded Audio:</h2>
                        <audio controls src={audioUrl} className="w-full max-w-md mx-auto" />
                    </div>
                )}
            </main>
        </div>
    )
}

export default MediaPage;