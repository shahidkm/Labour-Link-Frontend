import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetAllMuncipalities } from "../../../Hooks/Admin/MunicipalityHooks";

interface Municipality {
  municipalityId: number;
  name: string;
}

interface ComboBoxProps {
  onSelectMunicipality: (municipality: Municipality) => void;
}

export default function ComboBox({ onSelectMunicipality }: ComboBoxProps) {
  const { data, isLoading, error } = useGetAllMuncipalities();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading data</div>;

  return (
    <Autocomplete
      disablePortal
      options={data || []}
      sx={{ width: 200 }} // Reduced width from 300 to 200
      getOptionLabel={(option: Municipality) => option.name}
      onChange={(_, value) => {
        if (value) {
          console.log("🟢 Selected Municipality:", value);
          onSelectMunicipality(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Municipality"
          size="small" // Added small size to reduce input height
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#B0BEC5" },
              "&:hover fieldset": { borderColor: "#90A4AE" },
              "&.Mui-focused fieldset": { borderColor: "#78909C" },
            },
            "& .MuiInputLabel-root": { 
              color: "#9333EA",
              fontSize: "0.8rem", // Smaller font size
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#9333EA" },
          }}
        />
      )}
    />
  );
}