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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading skills</div>;

  return (
    <Autocomplete
      disablePortal
      options={data || []}
      sx={{ width: 200 }} // Reduced width from 300 to 200
      getOptionLabel={(option: { skillId: string; skillName: string }) =>
        option.skillName
      }
      onChange={(_, value) => {
        if (value) {
          onSelectSkill(value.skillName);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={required}
          label="Skills"
          variant="outlined"
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
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#9333EA",
            },
          }}
        />
      )}
    />
  );
}