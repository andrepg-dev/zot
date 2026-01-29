import { Module } from "@nestjs/common";
import { ReactToHtmlController } from "./react-to-html.controller";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";

@Module({
  controllers: [ReactToHtmlController],
  providers: [ReactToHtmlService],
})
export class ReactToHtmlModuleV1 {}
