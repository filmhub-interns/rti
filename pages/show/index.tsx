import { Episode, type Show } from "@/lib/iface";
import {
  Badge,
  Box,
  Center,
  Collapse,
  HStack,
  Heading,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Head from "next/head";

export const ShowHome = ({ id = 1 }) => {
  const query = useQuery({
    queryKey: ["show", id],
    queryFn: async () => {
      const res = await axios.get<
        Show & { _embedded: { episodes: Episode[] } }
      >(`https://api.tvmaze.com/shows/${id}?embed=episodes`);
      return res.data;
    },
  });

  const detailsOpen = true;

  return (
    <>
      <Head>
        <title>TVMaze Explorer</title>
      </Head>
      <main>
        <Center mt={5} mb={7} width={"100%"}>
          <VStack width={"100%"} px={5} spacing={5}>
            <Heading size={"md"}>TVMaze Explorer Presents:</Heading>
            <Heading>{query.data?.name}</Heading>
            <HStack>
              {query.data?.genres.map((genre) => (
                <Badge>{genre}</Badge>
              ))}
            </HStack>
            <Text fontWeight={"bold"} fontSize={"sm"}>
              {query.data?._embedded.episodes.length} episodes
            </Text>
            <HStack>
              <Switch isChecked={detailsOpen} onChange={() => {}} />
              <Text>Details</Text>
            </HStack>
            <Box
              p={7}
              maxWidth={"100%"}
              panelSize={"lg"}
              borderRadius={"lg"}
              border={"1px solid"}
              borderColor={"gray.300"}
            >
              <Collapse startingHeight={100} in={detailsOpen}>
                <Text>{JSON.stringify(query.data)}</Text> 
              </Collapse>
              {!detailsOpen && <Text>...</Text>}
            </Box>
          </VStack>
        </Center>
      </main>
    </>
  );
};

export default ShowHome;
