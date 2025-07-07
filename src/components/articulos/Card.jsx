import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import {format, parseISO} from "date-fns";

const StyledCard = styled.div`
  min-width: 60%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: aliceblue;
`;

const CardHeader = styled(Typography)`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

const CardTitle = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
`;

const CompanyName = styled(Typography)`
  color: #666;
  margin-bottom: 8px;
`;

const Description = styled(Typography)`
  font-size: 16px;
`;



export default function Card(props) {
    const { vacante } = props;
    const fechaAnalizada = parseISO(vacante.createdAt);
    const fechaFormateada = format(fechaAnalizada, 'dd/MM/yyyy');
    return (
        <StyledCard>
            <CardHeader color="textSecondary" gutterBottom>
                {fechaFormateada}
            </CardHeader>
            <CardTitle variant="h5" component="div">
                {vacante.name}
            </CardTitle>
            {vacante.compania && (
                <CompanyName color="textSecondary">
                    {vacante.compania.name}
                </CompanyName>
            )}
            <Description>
                {vacante.description}
            </Description>
        </StyledCard>
    );
}