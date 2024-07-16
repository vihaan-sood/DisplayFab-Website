import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import "../styles/Markdown.css"

function MarkdownPage() {
    const { pk } = useParams();
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        api.get(`/api/markdowntext/${pk}/`)
            .then((response) => {
                setMarkdown(response.data.content);
            })
            .catch((error) => {
                console.error('Error fetching markdown content:', error);
            });
    }, [pk]);

    return (
        <div className="markdown-page">
            <ReactMarkdown remarkPlugins={[gfm]}>{markdown}</ReactMarkdown>
        </div>
    );
}

export default MarkdownPage;