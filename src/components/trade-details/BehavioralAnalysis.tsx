
import { Trade } from "@/types/trade";

interface BehavioralAnalysisProps {
  trade: Trade;
}

export function BehavioralAnalysis({ trade }: BehavioralAnalysisProps) {
  // Determine if plan was followed based on exit reason
  const followedPlan = trade.exit_reason === 'target_reached' || trade.exit_reason === 'stop_loss';
  const isTarget = trade.exit_reason === "target_reached";
  const isImpulsive = trade.exit_reason === 'manual';

  // Calculate emotional consistency
  const emotionalConsistency = calculateEmotionalConsistency(trade);
  
  // Determine trader mindset based on entry/exit emotions
  const traderMindset = determineTraderMindset(trade);

  return (
    <div className="col-span-full bg-card p-4 rounded-lg border">
      <h4 className="text-sm font-medium mb-4">Behavioral Analysis</h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Followed Plan:</span>
            <p className="font-medium">{followedPlan ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Impulsive Exit:</span>
            <p className="font-medium">{isImpulsive ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        {!followedPlan && trade.exit_reason && (
          <div>
            <span className="text-sm text-muted-foreground">Deviation Type:</span>
            <p className="font-medium">{formatExitReason(trade.exit_reason)}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Entry Emotion:</span>
            <p className="font-medium">{trade.entry_emotion || 'Not recorded'}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Exit Emotion:</span>
            <p className="font-medium">{trade.exit_emotion || 'Not recorded'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-muted-foreground">Emotional Consistency:</span>
            <p className="font-medium">{emotionalConsistency}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Trader Mindset:</span>
            <p className="font-medium">{traderMindset}</p>
          </div>
        </div>
        
        {trade.emotional_score !== null && (
          <div>
            <span className="text-sm text-muted-foreground">Emotional Score:</span>
            <p className={`font-medium ${getEmotionalScoreColor(trade.emotional_score)}`}>
              {trade.emotional_score !== null ? trade.emotional_score.toFixed(1) : 'N/A'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to determine emotional consistency
function calculateEmotionalConsistency(trade: Trade): string {
  // If we don't have both emotions, return unknown
  if (!trade.entry_emotion || !trade.exit_emotion) {
    return 'Unknown';
  }
  
  // Positive entry emotions
  const positiveEntryEmotions = ['confident', 'neutral'];
  // Negative entry emotions
  const negativeEntryEmotions = ['fear', 'greed', 'fomo', 'revenge'];
  
  // Positive exit emotions
  const positiveExitEmotions = ['satisfied', 'relieved'];
  // Negative exit emotions
  const negativeExitEmotions = ['regretful', 'frustrated'];
  
  const entryEmotionType = positiveEntryEmotions.includes(trade.entry_emotion) 
    ? 'positive' 
    : negativeEntryEmotions.includes(trade.entry_emotion) 
      ? 'negative' : 'neutral';
      
  const exitEmotionType = positiveExitEmotions.includes(trade.exit_emotion) 
    ? 'positive' 
    : negativeExitEmotions.includes(trade.exit_emotion) 
      ? 'negative' : 'neutral';
  
  // Check if outcome matches emotional journey
  const isOutcomePositive = trade.outcome === 'profit';
  
  // Emotional consistency definitions
  if (entryEmotionType === 'positive' && exitEmotionType === 'positive' && isOutcomePositive) {
    return 'High (Positive)';
  } else if (entryEmotionType === 'negative' && exitEmotionType === 'negative' && !isOutcomePositive) {
    return 'High (Negative)';
  } else if ((entryEmotionType === 'positive' && exitEmotionType === 'negative') || 
             (entryEmotionType === 'negative' && exitEmotionType === 'positive')) {
    return 'Mixed';
  } else {
    return 'Inconsistent';
  }
}

// Helper function to determine trader mindset
function determineTraderMindset(trade: Trade): string {
  // Default if we don't have enough data
  if (!trade.entry_emotion || !trade.exit_emotion || !trade.exit_reason) {
    return 'Indeterminate';
  }
  
  // Disciplined trader indicators
  const isDisciplined = trade.exit_reason === 'target_reached' || trade.exit_reason === 'stop_loss';
  
  // Emotional trader indicators
  const isEmotionalEntry = ['fear', 'greed', 'fomo', 'revenge'].includes(trade.entry_emotion);
  const isEmotionalExit = ['regretful', 'frustrated'].includes(trade.exit_emotion);
  
  // Check for conflicting signals
  if (isDisciplined && !isEmotionalEntry && !isEmotionalExit) {
    return 'Disciplined';
  } else if (!isDisciplined && (isEmotionalEntry || isEmotionalExit)) {
    return 'Emotion-Driven';
  } else if (isDisciplined && (isEmotionalEntry || isEmotionalExit)) {
    return 'Mixed (Improving)';
  } else {
    return 'Developing';
  }
}

// Helper function to format exit reason for display
function formatExitReason(exitReason: string): string {
  switch (exitReason) {
    case 'manual':
      return 'Manual Override';
    case 'target_reached':
      return 'Target Reached';
    case 'stop_loss':
      return 'Stop Loss Hit';
    case 'time_based':
      return 'Time-Based Exit';
    default:
      return exitReason.charAt(0).toUpperCase() + exitReason.slice(1).replace('_', ' ');
  }
}

// Helper function to get color based on emotional score
function getEmotionalScoreColor(score: number | null): string {
  if (score === null) return '';
  
  if (score > 2) return 'text-green-600';
  if (score < -2) return 'text-red-600';
  return 'text-yellow-600';
}
