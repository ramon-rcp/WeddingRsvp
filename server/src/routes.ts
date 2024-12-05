import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { makeMap, MutableMap } from "./map";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

const guests: MutableMap<unknown> = makeMap();

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

/** Handles request for /save by storing the given square design. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const guest = req.body.content;
  if (guest === undefined) {
    res.status(400).send('required argument "content" was missing');
    return;
  }
  guests.set(name, guest)

  res.send({saved: true})
}


/** Handles request for /load by returning the design requested. */
export const load = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  if (!guests.contains(name)) {
    res.status(404).send(`could not find guest ${name}`);
    return;
  }
    
  res.send({name: name, content: guests.get(name)})
}

/** Handles request for /names by returning the list of design names. */
export const names = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({names: guests.getKeys()})
}

/** Handles request for /names by returning the list of design names. */
export const values = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({values: guests.getAllValues()})
}

/** Clears guests for testing */
export const clear = (): void => {
  guests.clear();
}
