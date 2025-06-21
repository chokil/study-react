class TicketService {
  constructor() {
    this.storageKey = 'tickets';
    this.loadTickets();
  }

  loadTickets() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.tickets = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load tickets:', error);
      this.tickets = [];
    }
  }

  saveTickets() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.tickets));
    } catch (error) {
      console.error('Failed to save tickets:', error);
    }
  }

  generateTicketId() {
    return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  issueTicket(eventName, eventDate, customerName, ticketType = 'general', quantity = 1) {
    const tickets = [];
    
    for (let i = 0; i < quantity; i++) {
      const ticket = {
        id: this.generateTicketId(),
        eventName,
        eventDate,
        customerName,
        ticketType,
        issuedAt: new Date().toISOString(),
        status: 'valid',
        usedAt: null,
      };
      
      this.tickets.push(ticket);
      tickets.push(ticket);
    }
    
    this.saveTickets();
    return tickets;
  }

  validateTicket(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    
    if (!ticket) {
      return { success: false, message: 'チケットが見つかりません' };
    }
    
    if (ticket.status === 'used') {
      return { success: false, message: 'このチケットは既に使用済みです' };
    }
    
    if (ticket.status === 'cancelled') {
      return { success: false, message: 'このチケットはキャンセルされています' };
    }
    
    const eventDate = new Date(ticket.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return { success: false, message: 'このチケットは期限切れです' };
    }
    
    ticket.status = 'used';
    ticket.usedAt = new Date().toISOString();
    this.saveTickets();
    
    return { success: true, message: 'チケットの検証に成功しました', ticket };
  }

  getTicket(ticketId) {
    return this.tickets.find(t => t.id === ticketId);
  }

  getAllTickets() {
    return [...this.tickets];
  }

  getTicketsByStatus(status) {
    return this.tickets.filter(t => t.status === status);
  }

  cancelTicket(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status === 'valid') {
      ticket.status = 'cancelled';
      this.saveTickets();
      return true;
    }
    return false;
  }

  getTicketStats() {
    const stats = {
      total: this.tickets.length,
      valid: 0,
      used: 0,
      cancelled: 0,
      todayUsed: 0,
    };
    
    const today = new Date().toDateString();
    
    this.tickets.forEach(ticket => {
      stats[ticket.status]++;
      
      if (ticket.usedAt && new Date(ticket.usedAt).toDateString() === today) {
        stats.todayUsed++;
      }
    });
    
    return stats;
  }
}

export default new TicketService();