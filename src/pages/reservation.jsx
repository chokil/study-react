import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "src/components/Layout";
import classes from "src/styles/Reservation.module.css";
import { useApp } from "src/contexts/AppContext";

// Simulated available time slots
const generateTimeSlots = (date) => {
  const slots = [];
  const baseTime = new Date(date);
  baseTime.setHours(9, 0, 0, 0);
  
  for (let i = 0; i < 20; i++) {
    const time = new Date(baseTime.getTime() + i * 30 * 60000);
    const isAvailable = Math.random() > 0.3;
    slots.push({
      id: `${date}-${i}`,
      time: time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
      available: isAvailable,
      popularity: Math.floor(Math.random() * 100),
    });
  }
  return slots;
};

// Service categories with unique features
const serviceCategories = [
  { id: 'consultation', name: '相談', icon: '💬', duration: 30, price: 3000 },
  { id: 'treatment', name: '治療', icon: '🏥', duration: 60, price: 8000 },
  { id: 'checkup', name: '検診', icon: '🔍', duration: 45, price: 5000 },
  { id: 'wellness', name: 'ウェルネス', icon: '🌿', duration: 90, price: 12000 },
];

const Reservation = () => {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  
  // AI-powered recommendation
  const [recommendation, setRecommendation] = useState(null);
  
  // Check if user is logged in
  useEffect(() => {
    if (!state.user?.isLoggedIn) {
      router.push('/login');
    }
  }, [state.user, router]);
  
  // Generate time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
      setSelectedSlot(null);
    }
  }, [selectedDate]);
  
  // AI recommendation based on user behavior
  useEffect(() => {
    if (selectedService) {
      const recommendedTime = timeSlots.find(slot => 
        slot.available && slot.popularity < 30
      );
      setRecommendation(recommendedTime);
    }
  }, [selectedService, timeSlots]);
  
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };
  
  const handleSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };
  
  const handleConfirmReservation = async () => {
    setIsConfirming(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "予約が完了しました！確認メールをお送りしました。",
          type: "success"
        }
      });
      
      // Reset form
      setStep(1);
      setSelectedService(null);
      setSelectedSlot(null);
      setNotes("");
      setIsConfirming(false);
    }, 1500);
  };
  
  const getDateDisplay = () => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };
  
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Layout title="予約システム">
      <div className={classes.reservationContainer}>
        <h1 className={classes.title}>スマート予約システム</h1>
        
        {/* Progress Indicator */}
        <div className={classes.progressBar}>
          <div className={`${classes.progressStep} ${step >= 1 ? classes.active : ''}`}>
            <span>1</span>
            <p>サービス選択</p>
          </div>
          <div className={`${classes.progressStep} ${step >= 2 ? classes.active : ''}`}>
            <span>2</span>
            <p>日時選択</p>
          </div>
          <div className={`${classes.progressStep} ${step >= 3 ? classes.active : ''}`}>
            <span>3</span>
            <p>確認</p>
          </div>
        </div>
        
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className={classes.stepContent}>
            <h2 className={classes.stepTitle}>サービスを選択してください</h2>
            <div className={classes.serviceGrid}>
              {serviceCategories.map(service => (
                <div
                  key={service.id}
                  className={classes.serviceCard}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className={classes.serviceIcon}>{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p className={classes.duration}>{service.duration}分</p>
                  <p className={classes.price}>¥{service.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 2: Date and Time Selection */}
        {step === 2 && (
          <div className={classes.stepContent}>
            <h2 className={classes.stepTitle}>日時を選択してください</h2>
            
            <div className={classes.selectedService}>
              <span>{selectedService.icon}</span>
              <span>{selectedService.name} ({selectedService.duration}分)</span>
              <button 
                className={classes.changeButton}
                onClick={() => setStep(1)}
              >
                変更
              </button>
            </div>
            
            <div className={classes.dateTimeSelector}>
              <div className={classes.dateSection}>
                <label>日付を選択</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={classes.dateInput}
                />
                <p className={classes.dateDisplay}>{getDateDisplay()}</p>
              </div>
              
              <div className={classes.timeSection}>
                <label>時間を選択</label>
                
                {recommendation && (
                  <div className={classes.aiRecommendation}>
                    <span className={classes.aiIcon}>🤖</span>
                    <p>AIのおすすめ: {recommendation.time}は混雑が少なく快適です</p>
                  </div>
                )}
                
                <div className={classes.timeSlotGrid}>
                  {timeSlots.map(slot => (
                    <button
                      key={slot.id}
                      className={`${classes.timeSlot} 
                        ${!slot.available ? classes.unavailable : ''}
                        ${selectedSlot?.id === slot.id ? classes.selected : ''}
                        ${recommendation?.id === slot.id ? classes.recommended : ''}`}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!slot.available}
                    >
                      <span>{slot.time}</span>
                      {slot.popularity > 70 && slot.available && (
                        <span className={classes.popularBadge}>人気</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={classes.actionButtons}>
              <button 
                className={classes.backButton}
                onClick={() => setStep(1)}
              >
                戻る
              </button>
              <button 
                className={classes.nextButton}
                onClick={() => setStep(3)}
                disabled={!selectedSlot}
              >
                次へ
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className={classes.stepContent}>
            <h2 className={classes.stepTitle}>予約内容の確認</h2>
            
            <div className={classes.confirmationCard}>
              <div className={classes.confirmationItem}>
                <label>サービス</label>
                <p>{selectedService.icon} {selectedService.name}</p>
              </div>
              
              <div className={classes.confirmationItem}>
                <label>日時</label>
                <p>{getDateDisplay()}</p>
                <p>{selectedSlot?.time}</p>
              </div>
              
              <div className={classes.confirmationItem}>
                <label>所要時間</label>
                <p>{selectedService.duration}分</p>
              </div>
              
              <div className={classes.confirmationItem}>
                <label>料金</label>
                <p className={classes.priceDisplay}>¥{selectedService.price.toLocaleString()}</p>
              </div>
              
              <div className={classes.notesSection}>
                <label>メモ・要望（任意）</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="特別な要望があればご記入ください"
                  className={classes.notesInput}
                  rows={3}
                />
              </div>
            </div>
            
            <div className={classes.paymentInfo}>
              <p>💳 お支払いは当日現地にて承ります</p>
              <p>📧 予約確認メールを {state.user?.email} に送信します</p>
            </div>
            
            <div className={classes.actionButtons}>
              <button 
                className={classes.backButton}
                onClick={() => setStep(2)}
              >
                戻る
              </button>
              <button 
                className={classes.confirmButton}
                onClick={handleConfirmReservation}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <span className={classes.loadingSpinner}>予約処理中...</span>
                ) : (
                  "予約を確定する"
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className={classes.quickActions}>
          <button className={classes.quickAction} onClick={() => router.push('/')}>
            🏠 ホームに戻る
          </button>
          <button className={classes.quickAction}>
            📅 予約履歴
          </button>
          <button className={classes.quickAction}>
            ❓ ヘルプ
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Reservation;