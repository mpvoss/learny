import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import { ConceptMapDiagramData, ConceptMapEntity, Diagram } from '../models';
import Masonry from '@mui/lab/Masonry';
import { Link } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PlaceIcon from '@mui/icons-material/Place';
import CampaignIcon from '@mui/icons-material/Campaign';
import PublicIcon from '@mui/icons-material/Public';
import ArticleIcon from '@mui/icons-material/Article';
import ScienceIcon from '@mui/icons-material/Science';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConstructionIcon from '@mui/icons-material/Construction';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const getIcon = (name: string) => {
    const lookup = [];
    lookup.push({ keywords: ["People", "Person", "Individual", "Scientist", "group"], icon: PeopleIcon });
    lookup.push({ keywords: ["Event"], icon: EventIcon });
    lookup.push({ keywords: ["Organization"], icon: CorporateFareIcon });
    lookup.push({ keywords: ["Place", "Location", "Geographic", "Area"], icon: PlaceIcon });
    lookup.push({ keywords: ["Movement", "Program", "Process", "Action", "Campaign"], icon: CampaignIcon });
    lookup.push({ keywords: ["Government", "Country", "Global", "Nation"], icon: PublicIcon });
    lookup.push({ keywords: ["Document"], icon: ArticleIcon });
    lookup.push({ keywords: ["Technology", "Innovation", "Equipment"], icon: ScienceIcon });
    lookup.push({ keywords: ["Epidemic", "Vaccine", "Health", "Medical"], icon: MedicalInformationIcon });
    lookup.push({ keywords: ["disease", "pathogen", "virus", "symptom"], icon: CoronavirusIcon });
    lookup.push({ keywords: ["economic", "economy"], icon: AttachMoneyIcon });
    lookup.push({ keywords: ["infrastructure", "construct"], icon: ConstructionIcon });
    lookup.push({ keywords: ["transport"], icon: EmojiTransportationIcon });
    lookup.push({ keywords: ["trade"], icon: LocalGroceryStoreIcon });
    lookup.push({ keywords: ["competition"], icon: EmojiEventsIcon });
    lookup.push({ keywords: ["change"], icon: ChangeCircleIcon });
    lookup.push({ keywords: ["social"], icon: GroupsIcon });

    // men


    for (const item of lookup) {
        for (const keyword of item.keywords) {
            if (name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) {
                return item.icon;
            }
        }
    }

    return null;
}


interface ConceptMapDiagramProps {
    diagram: Diagram;
    handleSendMessage: (msg: string) => void;
}

const ConceptMapDiagram: React.FC<ConceptMapDiagramProps> = ({ diagram, handleSendMessage }) => {
    const [mapData, setMapData] = useState({} as { [key: string]: any });


    const handleClick = (name: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();

        let prompt = "On the topic of " + diagram.name + ", could you tell me more about " + name + "?";
        console.log(prompt);
        handleSendMessage(prompt);
    };

    const handleQuestionClick = (item: string) => {
        if (mapData) {
            let joinedItems = (mapData[item]["items"] as [{ name: string }]).map((obj: any) => obj.name).join(', ')
            let prompt = "On the topic of " + diagram.name + ", could you tell me more about " + joinedItems + "?";
            handleSendMessage(prompt);
        }
    };

    useEffect(() => {
        if (!diagram) {
            return;
        }

        let entities = diagram.data.entities as ConceptMapEntity[];

        const groupByType = entities.reduce((acc: { [key: string]: any }, entity) => {
            const category = entity['category'];
            if (!acc[category]) {
                acc[category] = {};
                acc[category]["items"] = [];
            }
            acc[category]["items"].push(entity);

            return acc;
        }, {});

        Object.entries(groupByType).forEach(([key, value]) => {
            const icon = getIcon(key);
            value["icon"] = icon;
        });

        setMapData(groupByType);

    }, [diagram]);

    return (
        <Masonry columns={{ xs: 1, md: 3, lg: 4 }} spacing={3}>
            {mapData && Object.entries(mapData).map(([key, value]) => (
                <Card key={key} style={{ textAlign: "left" }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center">
                                    {value.icon && <value.icon style={{ marginRight: 10 }} />}
                                    {key}
                                </Box>
                                <Tooltip title="Ask the AI for details on these items">
                                    <IconButton onClick={() => handleQuestionClick(key)}>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Typography>
                        <ul>
                            {value.items.map((entity: { id: React.Key | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }) => (
                                <li key={entity.id}>
                                    <Link href="#" onClick={handleClick(entity.name as string)}>
                                        {entity.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </Masonry>
    );
};

export default ConceptMapDiagram;

