import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GrokCompanion } from 'src/components/GrokCompanion';

// Mock crypto for Node.js environment
const mockCrypto = {
  getRandomValues: jest.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  })
};

// Setup global crypto mock
global.crypto = mockCrypto;

describe('GrokCompanion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockCrypto.getRandomValues.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders the component correctly', () => {
    render(<GrokCompanion />);
    
    expect(screen.getByText('Grok Companion')).toBeInTheDocument();
    expect(screen.getByLabelText('メッセージを入力')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /送信/ })).toBeInTheDocument();
  });

  test('displays initial intro message', () => {
    render(<GrokCompanion />);
    
    expect(screen.getByText(/GROK COMPANION オンライン/)).toBeInTheDocument();
  });

  test('can send a message', async () => {
    render(<GrokCompanion />);
    
    const textarea = screen.getByLabelText('メッセージを入力');
    const sendButton = screen.getByRole('button', { name: /送信/ });
    
    fireEvent.change(textarea, { target: { value: 'テストメッセージ' } });
    fireEvent.click(sendButton);
    
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
    expect(textarea.value).toBe('');
  });

  test('shows typing indicator when processing response', () => {
    render(<GrokCompanion />);
    
    const textarea = screen.getByLabelText('メッセージを入力');
    fireEvent.change(textarea, { target: { value: 'テスト' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    expect(screen.getByText('応答を生成中…')).toBeInTheDocument();
  });

  test('can change snark level', () => {
    render(<GrokCompanion />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2' } });
    
    expect(screen.getByText('FULL GROK')).toBeInTheDocument();
  });

  test('can select topic buttons', () => {
    render(<GrokCompanion />);
    
    const topicButton = screen.getByRole('button', { name: /量子コーヒーメーカー問題/ });
    fireEvent.click(topicButton);
    
    expect(topicButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('can clear conversation', () => {
    render(<GrokCompanion />);
    
    // Send a message first
    const textarea = screen.getByLabelText('メッセージを入力');
    fireEvent.change(textarea, { target: { value: 'テスト' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    // Clear conversation
    const clearButton = screen.getByRole('button', { name: /ログをクリア/ });
    fireEvent.click(clearButton);
    
    // Should only show intro message
    const messages = screen.getAllByText(/GROK COMPANION オンライン/);
    expect(messages).toHaveLength(1);
  });

  test('handles keyboard shortcuts', () => {
    render(<GrokCompanion />);
    
    const textarea = screen.getByLabelText('メッセージを入力');
    
    // Test Ctrl+K shortcut
    fireEvent.keyDown(textarea, { key: 'k', ctrlKey: true });
    
    // Should clear and show only intro message
    expect(screen.getByText(/GROK COMPANION オンライン/)).toBeInTheDocument();
  });

  test('sends message on Enter keypress', () => {
    render(<GrokCompanion />);
    
    const textarea = screen.getByLabelText('メッセージを入力');
    fireEvent.change(textarea, { target: { value: 'Enterテスト' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    expect(screen.getByText('Enterテスト')).toBeInTheDocument();
  });

  test('adds new line on Shift+Enter', () => {
    render(<GrokCompanion />);
    
    const textarea = screen.getByLabelText('メッセージを入力');
    fireEvent.change(textarea, { target: { value: 'Line 1' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    
    // Should not send message, textarea should still have value
    expect(textarea.value).toBe('Line 1');
    expect(screen.queryByText('Line 1')).not.toBeInTheDocument();
  });

  test('displays session statistics correctly', () => {
    render(<GrokCompanion />);
    
    expect(screen.getByText(/CHAOS INDEX/)).toBeInTheDocument();
    expect(screen.getByText(/SESSION EXCHANGES/)).toBeInTheDocument();
    expect(screen.getByText(/EMPATHY BUFFER/)).toBeInTheDocument();
  });

  test('disables send button when input is empty', () => {
    render(<GrokCompanion />);
    
    const sendButton = screen.getByRole('button', { name: /送信/ });
    expect(sendButton).toBeDisabled();
    
    const textarea = screen.getByLabelText('メッセージを入力');
    fireEvent.change(textarea, { target: { value: 'テスト' } });
    
    expect(sendButton).not.toBeDisabled();
  });

  test('uses secure random values when crypto is available', () => {
    render(<GrokCompanion />);
    
    const textarea = screen.getByLabelText('メッセージを入力');
    fireEvent.change(textarea, { target: { value: 'テスト' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    // Verify crypto.getRandomValues was called for ID generation
    expect(mockCrypto.getRandomValues).toHaveBeenCalled();
  });
});