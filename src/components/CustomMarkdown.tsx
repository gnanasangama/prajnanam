import React from 'react';
import ReactMarkdown from 'react-markdown';

interface CustomMarkdownProps {
    content: string;
}

const CustomMarkdown = ({ content }: CustomMarkdownProps) => {
    return (
        <ReactMarkdown
            components={{
                // Custom styling for horizontal rule (hr)
                hr: () => (
                    <hr className="my-4 border-t border-gray-300" />
                ),

                // Custom styling for blockquotes
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 pl-4 italic border-gray-400 my-4">
                        {children}
                    </blockquote>
                ),

                // Custom styling for headings
                h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{children}</h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-gray-800 mt-2 mb-2">{children}</h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-700 mt-2 mb-1">{children}</h3>
                ),

                // Custom styling for lists
                ul: ({ children }) => (
                    <ul className="list-disc list-inside pl-5 text-gray-700">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal list-inside pl-5 text-gray-700">{children}</ol>
                ),

                // Custom styling for list items
                li: ({ children }) => (
                    <li className="my-2">{children}</li>
                ),

                // Custom styling for inline code
                code: ({ children }) => (
                    <code className="bg-gray-100 px-1 py-0.5 rounded-sm text-sm text-gray-700">{children}</code>
                ),

                // Custom styling for code blocks
                pre: ({ children }) => (
                    <pre className="bg-gray-900 text-white p-4 rounded-md overflow-auto">{children}</pre>
                ),

                // Custom styling for links
                a: ({ href, children }) => (
                    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),

                // Custom styling for images
                img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="max-w-full h-auto my-4" />
                ),
            }}
        >{content}</ReactMarkdown>
    );
};

export default CustomMarkdown;