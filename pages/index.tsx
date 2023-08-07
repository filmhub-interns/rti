import { slowClient } from "@/lib/client";
import { SearchResults } from "@/lib/iface";
import {
  Card,
  CardBody,
  Center,
  HStack,
  Heading,
  Image,
  Input,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { stripHtml } from "string-strip-html";
import { useDebounce } from "use-debounce";

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

interface FormData {
  searchTerm: string;
}

export const SearchHome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qs = searchParams.get("q");
  const {
    register,
    watch,
    formState: {},
  } = useForm<FormData>({ defaultValues: { searchTerm: qs || '' } });

  const [searchTerm] = useDebounce(watch("searchTerm"), 500);
  const query = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: async () => {
      const res = await slowClient.get<SearchResults>(
        `https://api.tvmaze.com/search/shows?q=${searchTerm}`
      );
      return res.data;
    },
    enabled: !!searchTerm,
  });
  useEffect(() => {
    if (qs != searchTerm) {
      // Only replace when necessary or scroll restoration breaks.
      router.replace(`?q=${searchTerm}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
      <Head>
        <title>TVMaze Explorer</title>
      </Head>
      <main>
        <Center mt={5} mb={7} width={"100%"}>
          <VStack width={"100%"} px={5} spacing={5}>
            <Heading>TVMaze Explorer</Heading>
            <Input placeholder="Search..." {...register("searchTerm", {})} />
            <SimpleGrid spacing={4} width={"100%"}>
              {query.data?.map((v) => {
                return (
                  <LinkBox key={v.show.id}>
                    <Card overflow={"hidden"} direction={"row"}>
                      <Image
                        alt={`Poster for ${v.show.name}`}
                        src={
                          v.show.image?.medium ??
                          "https://via.placeholder.com/210x295"
                        }
                      />
                      <Stack>
                        <CardBody>
                          <Heading size={"md"}>
                            <LinkOverlay as={NextLink} href={`/show/`}>
                              {v.show.name}
                            </LinkOverlay>
                          </Heading>
                          <Stack>
                            <Text pt={2}>
                              {
                                stripHtml(
                                  v.show.summary ?? "No description provided"
                                ).result
                              }
                            </Text>
                            <HStack>
                              {v.show.network?.name && (
                                <Text
                                  color={"gray.600"}
                                  fontStyle={"italic"}
                                  fontWeight={600}
                                  fontSize={"sm"}
                                >
                                  {v.show.network.name}
                                </Text>
                              )}
                              <Text fontSize={"sm"}>
                                {v.show.premiered?.substring(0, 4)} -{" "}
                                {v.show.ended?.substring(0, 4)}
                              </Text>
                              {v.show.network?.country?.code && (
                                <Text>
                                  {getFlagEmoji(v.show.network.country.code)}
                                </Text>
                              )}
                            </HStack>
                          </Stack>
                        </CardBody>
                      </Stack>
                    </Card>
                  </LinkBox>
                );
              })}
            </SimpleGrid>
          </VStack>
        </Center>
      </main>
    </>
  );
};

export default SearchHome;
