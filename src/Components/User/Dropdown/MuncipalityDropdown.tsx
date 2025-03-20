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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <Autocomplete
      disablePortal
      options={data || []}
      sx={{ width: 300 }}
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
          label="Select Municipality"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#B0BEC5" },
              "&:hover fieldset": { borderColor: "#90A4AE" },
              "&.Mui-focused fieldset": { borderColor: "#78909C" },
            },
            "& .MuiInputLabel-root": { color: "#9333EA" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#9333EA" },
          }}
        />
      )}
    />
  );
}
