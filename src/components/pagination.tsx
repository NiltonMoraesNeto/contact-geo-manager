import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, IconButton, Typography } from "@mui/material";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
}

export function Pagination({ page, totalPages, setPage }: PaginationProps) {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      mt={4}
      gap={1}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mr: 2, fontFamily: "sans-serif" }}
      >
        {page} de {totalPages}
      </Typography>

      <IconButton
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        color="primary"
        sx={{
          borderRadius: 2,
          bgcolor: "grey.100",
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        color="primary"
        sx={{
          borderRadius: 2,
          bgcolor: "grey.100",
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
