import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import  LinearProgress  from "@mui/material/LinearProgress";

interface AudioAnalysisDialogProps {
    openDialog: boolean;
    randomFact: string | null;
}

export const AudioAnalysisDialog = ({ openDialog, randomFact }: AudioAnalysisDialogProps) => {
  return (
    <Dialog open={openDialog}>
      <DialogTitle>
        Your Audio is being analyzed. Please be patient.
      </DialogTitle>
      <DialogContent>
        <div className="w-full relative">
          <LinearProgress />
          {/* <span className="text-xs">{progress.toFixed(0)}%</span> */}
        </div>
        <p className="mt-4 text-sm">Did you know? &quot;{randomFact}&quot;</p>
      </DialogContent>
    </Dialog>
  );
};
