export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const PagePartsFragmentDoc = gql`
    fragment PageParts on Page {
  __typename
  seoTitle
  blocks {
    __typename
    ... on PageBlocksHero {
      eyebrow
      headline
      tagline
      primaryAction {
        __typename
        label
        link
      }
      secondaryAction {
        __typename
        label
        link
      }
      image {
        __typename
        src
        alt
      }
    }
    ... on PageBlocksRichText {
      eyebrow
      headline
      body
    }
    ... on PageBlocksMedia {
      image {
        __typename
        src
        alt
        caption
      }
      aspect
    }
    ... on PageBlocksCta {
      headline
      text
      primaryLabel
      primaryLink
      secondaryLabel
      secondaryLink
    }
    ... on PageBlocksGallery {
      headline
      images {
        __typename
        src
        alt
        caption
      }
    }
    ... on PageBlocksAccordion {
      headline
      items {
        __typename
        title
        content
      }
    }
    ... on PageBlocksStats {
      headline
      items {
        __typename
        value
        label
      }
    }
    ... on PageBlocksTestimonial {
      quote
      author
      role
      avatar {
        __typename
        src
        alt
      }
    }
  }
}
    `;
export const BlogPartsFragmentDoc = gql`
    fragment BlogParts on Blog {
  __typename
  title
  description
  pubDate
  heroImage
  body
}
    `;
export const ConfigPartsFragmentDoc = gql`
    fragment ConfigParts on Config {
  __typename
  seo {
    __typename
    title
    description
  }
  nav {
    __typename
    title
    link
  }
  footerNote
}
    `;
export const PageDocument = gql`
    query page($relativePath: String!) {
  page(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PageParts
  }
}
    ${PagePartsFragmentDoc}`;
export const PageConnectionDocument = gql`
    query pageConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PageFilter) {
  pageConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PageParts
      }
    }
  }
}
    ${PagePartsFragmentDoc}`;
export const BlogDocument = gql`
    query blog($relativePath: String!) {
  blog(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...BlogParts
  }
}
    ${BlogPartsFragmentDoc}`;
export const BlogConnectionDocument = gql`
    query blogConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: BlogFilter) {
  blogConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...BlogParts
      }
    }
  }
}
    ${BlogPartsFragmentDoc}`;
export const ConfigDocument = gql`
    query config($relativePath: String!) {
  config(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConfigParts
  }
}
    ${ConfigPartsFragmentDoc}`;
export const ConfigConnectionDocument = gql`
    query configConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConfigFilter) {
  configConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConfigParts
      }
    }
  }
}
    ${ConfigPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    page(variables, options) {
      return requester(PageDocument, variables, options);
    },
    pageConnection(variables, options) {
      return requester(PageConnectionDocument, variables, options);
    },
    blog(variables, options) {
      return requester(BlogDocument, variables, options);
    },
    blogConnection(variables, options) {
      return requester(BlogConnectionDocument, variables, options);
    },
    config(variables, options) {
      return requester(ConfigDocument, variables, options);
    },
    configConnection(variables, options) {
      return requester(ConfigConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
