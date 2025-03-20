import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetAllSkill } from "../../../Hooks/Admin/SkillHooks";

interface SkillDropdownProps {
  onSelectSkill: (value: string) => void;
  required?: boolean;
}

export default function SkillDropdown({
  onSelectSkill,
  required = false,
}: SkillDropdownProps) {
  const { data, isLoading, error } = useGetAllSkill();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading skills. Please try again later.</div>;
  }

  return (
    <Autocomplete
      disablePortal
      options={data || []}
      sx={{ width: 300 }}
      getOptionLabel={(option: { skillId: string; skillName: string }) =>
        option.skillName
      }
      onChange={(_, value) => {
        if (value) {
          onSelectSkill(value.skillId); 
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
            label="Select Skills"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#B0BEC5" },
              "&:hover fieldset": { borderColor: "#90A4AE" },
              "&.Mui-focused fieldset": { borderColor: "#78909C" },
            },
            "& .MuiInputLabel-root": {
              color: "#9333EA",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#9333EA",
            },
          }}
        />
      )}
    />
  );
}
