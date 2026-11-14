'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chatRequestSchema, ChatRequest } from '@vlr-finance/schemas';

export default function AiCopilotPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { register, handleSubmit, reset } = useForm<ChatRequest>({
    resolver: zodResolver(chatRequestSchema),
  });

  const onSubmit = async (data: ChatRequest) => {
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: 'user', content: data.message }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') {
              assistantMessage += data.content;
              setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'assistant') {
                  return [...prev.slice(0, -1), { ...lastMessage, content: assistantMessage }];
                }
                return [...prev, { role: 'assistant', content: assistantMessage }];
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsStreaming(false);
      reset();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">AI Copilot</h2>
      
      <div className="mb-4 max-h-96 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-50 ml-auto' : 'bg-gray-50'}`}>
            <div className="font-medium text-sm text-gray-600 mb-1">{msg.role}</div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <input
          type="text"
          {...register('message')}
          placeholder="Ask me anything about your portfolio..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isStreaming}
        />
        <button
          type="submit"
          disabled={isStreaming}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isStreaming ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
