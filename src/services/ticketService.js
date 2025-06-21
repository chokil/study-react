const TICKET_STORAGE_KEY = 'tickets';

const generateTicketId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TKT-${timestamp}-${random}`;
};

const generateQRCode = (ticketId) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}`;
};

export const ticketService = {
  getAllTickets() {
    if (typeof window === 'undefined') return [];
    const storedTickets = localStorage.getItem(TICKET_STORAGE_KEY);
    return storedTickets ? JSON.parse(storedTickets) : [];
  },

  saveTickets(tickets) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
  },

  issueTicket(ticketData) {
    const ticketId = generateTicketId();
    const newTicket = {
      id: ticketId,
      ...ticketData,
      qrCode: generateQRCode(ticketId),
      issuedAt: new Date().toISOString(),
      status: 'active',
      validatedAt: null,
    };

    const tickets = this.getAllTickets();
    tickets.push(newTicket);
    this.saveTickets(tickets);

    return newTicket;
  },

  validateTicket(ticketId) {
    const tickets = this.getAllTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return { success: false, message: 'チケットが見つかりません' };
    }

    const ticket = tickets[ticketIndex];

    if (ticket.status === 'used') {
      return { 
        success: false, 
        message: 'このチケットは既に使用されています',
        ticket 
      };
    }

    if (ticket.status === 'cancelled') {
      return { 
        success: false, 
        message: 'このチケットはキャンセルされています',
        ticket 
      };
    }

    if (ticket.expiryDate && new Date(ticket.expiryDate) < new Date()) {
      return { 
        success: false, 
        message: 'このチケットは有効期限が切れています',
        ticket 
      };
    }

    tickets[ticketIndex] = {
      ...ticket,
      status: 'used',
      validatedAt: new Date().toISOString(),
    };

    this.saveTickets(tickets);

    return { 
      success: true, 
      message: 'チケットの検証が完了しました',
      ticket: tickets[ticketIndex] 
    };
  },

  getTicketById(ticketId) {
    const tickets = this.getAllTickets();
    return tickets.find(t => t.id === ticketId);
  },

  cancelTicket(ticketId) {
    const tickets = this.getAllTickets();
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) {
      return { success: false, message: 'チケットが見つかりません' };
    }

    if (tickets[ticketIndex].status === 'used') {
      return { success: false, message: '使用済みのチケットはキャンセルできません' };
    }

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    };

    this.saveTickets(tickets);

    return { success: true, message: 'チケットをキャンセルしました' };
  },

  getActiveTickets() {
    return this.getAllTickets().filter(t => t.status === 'active');
  },

  getUsedTickets() {
    return this.getAllTickets().filter(t => t.status === 'used');
  },

  clearAllTickets() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TICKET_STORAGE_KEY);
  }
};